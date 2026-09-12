#!/usr/bin/env node
/**
 * One-shot: migrate Tone blog posts → Fourfold writing collection.
 * Run from astro-fourfold root: node scripts/migrate-from-tone.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

const ROOT = process.cwd();
const TONE = path.resolve(ROOT, '../astro-tone-kirishima');
const TONE_CONTENT = path.join(TONE, 'src/content/blog');
const TONE_ASSETS = path.join(TONE, 'src/assets');
const OUT_WRITING = path.join(ROOT, 'src/content/writing');
const REDIRECTS_OUT = path.join(ROOT, 'scripts/generated-tone-redirects.json');

const SLUG_RENAMES = {
  'kirishima/Vignettes/2026/04/A-Winter-Letter.md': 'A-Winter-Letter-2026-04.md',
  'kirishima/Vignettes/2026/09/A-Winter-Letter.md': 'A-Winter-Letter-2026-09.md',
};

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}

function extractCommentedTags(frontmatterRaw) {
  const tags = [];
  const lines = frontmatterRaw.split('\n');
  let inTags = false;
  for (const line of lines) {
    if (/^#\s*tags:\s*$/.test(line)) {
      inTags = true;
      continue;
    }
    if (inTags) {
      const m = line.match(/^#\s*-\s*(.+)\s*$/);
      if (m) {
        tags.push(m[1].trim().replace(/^['"]|['"]$/g, ''));
        continue;
      }
      if (/^#/.test(line) && line.trim() !== '#') {
        // still a comment but not a tag item — stop if not list-like
        if (!/^#\s*-/.test(line)) inTags = false;
      } else if (!/^#/.test(line) && line.trim() !== '') {
        inTags = false;
      }
    }
  }
  return tags;
}

function stripFrontmatter(source) {
  // Tone content uses CRLF in many files; always accept \r?\n.
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { raw: '', data: {}, body: source };
  const raw = match[1].replace(/\r\n/g, '\n');
  let data = {};
  const cleaned = raw
    .replace(/^author:\s*$/m, 'author: Kirishima')
    .replace(/^#.*$/gm, '');
  try {
    data = parseYaml(cleaned) ?? {};
  } catch (error) {
    throw new Error(`YAML parse failed: ${error.message}\n---\n${cleaned}\n---`);
  }
  return { raw, data, body: source.slice(match[0].length) };
}

function firstParagraphDescription(body, title) {
  const text = body
    .replace(/^import\s+.+$/gm, '')
    .replace(/^<[A-Z][\s\S]*?\/>/gm, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return title;
  return text.length > 160 ? `${text.slice(0, 157).trim()}…` : text;
}

function resolveHeroToPublic(heroRef, sourceFile) {
  if (!heroRef || typeof heroRef !== 'string') return undefined;
  const trimmed = heroRef.trim();
  if (trimmed.startsWith('#')) return undefined;

  let abs;
  if (trimmed.startsWith('.') || trimmed.includes('/')) {
    abs = path.resolve(path.dirname(sourceFile), trimmed);
  } else {
    abs = path.join(TONE_ASSETS, trimmed);
  }

  // Tone paths like ../../../../../../assets/foo.jpg resolve to src/assets via relative from content
  // Also try mapping .../assets/X → src/assets/X
  if (!fs.existsSync(abs)) {
    const m = trimmed.match(/(?:^|\/)assets\/(.+)$/);
    if (m) abs = path.join(TONE_ASSETS, m[1]);
  }
  if (!fs.existsSync(abs)) return undefined;

  const rel = path.relative(TONE_ASSETS, abs).replace(/\\/g, '/');
  if (rel.startsWith('..')) return undefined;
  return `/assets/${rel}`;
}

function componentImportPrefix(destRelDir) {
  const depth = destRelDir.split(/[/\\]/).filter(Boolean).length;
  // writing/ is under src/content/ → climb depth + 2 to reach src/
  return `${'../'.repeat(depth + 2)}components/content/`;
}

function rewriteBody(body, destRelDir = '') {
  const prefix = componentImportPrefix(destRelDir);
  return body.replace(
    /import\s+(\w+)\s+from\s+["'][^"']*components\/(\w+)\.astro["'];?/g,
    (_m, name, file) => `import ${name} from '${prefix}${file}.astro';`,
  );
}

function clearWritingTree(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      clearWritingTree(full);
      // remove dir if empty after
      if (fs.readdirSync(full).length === 0) fs.rmdirSync(full);
    } else if (/\.(md|mdx)$/.test(name)) {
      fs.unlinkSync(full);
    }
  }
}

function yamlSafe(data) {
  return stringifyYaml(data, { lineWidth: 0 }).trimEnd();
}

function main() {
  fs.mkdirSync(OUT_WRITING, { recursive: true });
  clearWritingTree(OUT_WRITING);

  const files = walk(TONE_CONTENT).filter((f) => /\.(md|mdx)$/.test(f) && !f.endsWith('.disable'));
  const preferredTagCase = new Set([
    'Announcement',
    'Development',
    'Excerpt',
    'Fragments',
    'Novels',
    'Reflexion',
    'Report',
    'Vignettes',
    'Wiki',
  ]);
  const globalTagCanonical = new Map();
  const prepared = [];
  const usedSlugs = new Set();

  for (const file of files) {
    const rel = path.relative(TONE_CONTENT, file).replace(/\\/g, '/');
    const source = fs.readFileSync(file, 'utf8');
    const { raw, data, body } = stripFrontmatter(source);

    if (!data.title || !data.pubDate) {
      throw new Error(`Missing title/pubDate after parse: ${rel}`);
    }

    const title = String(data.title);
    const pubDate = new Date(data.pubDate);
    if (Number.isNaN(pubDate.valueOf())) throw new Error(`Bad pubDate in ${rel}`);

    const tagBySlug = new Map();
    const addTag = (value) => {
      const tag = String(value).trim();
      if (!tag) return;
      const slug = tag.toLowerCase().replace(/[\\/?#%]+/g, '-').replace(/\s+/g, '-');
      if (!tagBySlug.has(slug)) tagBySlug.set(slug, tag);
      if (preferredTagCase.has(tag) || !globalTagCanonical.has(slug)) globalTagCanonical.set(slug, tag);
      if (preferredTagCase.has(tag)) globalTagCanonical.set(slug, tag);
    };
    if (data.category) addTag(data.category);
    for (const t of extractCommentedTags(raw)) addTag(t);
    if (Array.isArray(data.tags)) for (const t of data.tags) addTag(t);

    const description =
      (typeof data.description === 'string' && data.description.trim()) ||
      firstParagraphDescription(body, title);

    const ogImage = resolveHeroToPublic(data.heroImage, file);

    // Nest under original category path; drop author root (kirishima/kui).
    const nestedRel = rel.replace(/^(kirishima|kui)\//, '');
    const nestedDir = path.dirname(nestedRel);
    let outName = SLUG_RENAMES[rel] ?? path.basename(file);
    const base = outName.replace(/\.(md|mdx)$/, '');
    const ext = path.extname(outName);
    let candidate = outName;
    let i = 2;
    while (usedSlugs.has(candidate.replace(/\.(md|mdx)$/, ''))) {
      candidate = `${base}-${i}${ext}`;
      i += 1;
    }
    usedSlugs.add(candidate.replace(/\.(md|mdx)$/, ''));
    outName = candidate;
    const outRel = nestedDir === '.' ? outName : path.join(nestedDir, outName);

    prepared.push({
      rel,
      outRel,
      outName,
      nestedDir: nestedDir === '.' ? '' : nestedDir,
      pubDate,
      body,
      ogImage,
      title,
      description,
      data,
      localTags: [...tagBySlug.keys()],
    });
  }

  const redirects = {};
  let count = 0;
  for (const item of prepared) {
    const tags = item.localTags.map((slug) => globalTagCanonical.get(slug) ?? slug);
    const outData = {
      title: item.title,
      description: item.description,
      locale: 'zh-cn',
      publishedAt: item.pubDate.toISOString().slice(0, 10),
      author: item.data.author && String(item.data.author).trim() ? String(item.data.author) : 'Kirishima',
      tags,
      featured: item.data.homeFeatured === true,
      draft: item.data.draft === true,
    };
    if (item.data.updatedDate) {
      const u = new Date(item.data.updatedDate);
      if (!Number.isNaN(u.valueOf())) outData.updatedAt = u.toISOString().slice(0, 10);
    }
    if (item.ogImage) outData.ogImage = item.ogImage;

    const newBody = rewriteBody(item.body, item.nestedDir).replace(/\r\n/g, '\n');
    const outPath = path.join(OUT_WRITING, item.outRel);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    const outSource = `---\n${yamlSafe(outData)}\n---\n\n${newBody.replace(/^\n+/, '')}`;
    fs.writeFileSync(outPath, outSource, 'utf8');

    const toneId = item.rel.replace(/\.(md|mdx)$/, '');
    const year = item.pubDate.getFullYear();
    const month = String(item.pubDate.getMonth() + 1).padStart(2, '0');
    const slug = item.outName.replace(/\.(md|mdx)$/, '');
    redirects[`/blog/${toneId}/`] = `/writing/${year}/${month}/${slug}/`;

    count += 1;
    console.log(`✓ ${item.rel} → writing/${item.outRel}`);
  }

  fs.writeFileSync(REDIRECTS_OUT, JSON.stringify(redirects, null, 2));
  console.log(`\nMigrated ${count} posts.`);
  console.log(`Redirects → ${path.relative(ROOT, REDIRECTS_OUT)}`);
}

main();

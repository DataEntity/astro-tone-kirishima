const siteOrigin = (import.meta.env.SITE_URL ?? 'https://blog.kirishima.dev').replace(/\/$/, '');
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');
const siteUrl = `${siteOrigin}${basePath}`;

export const site = {
  name: 'Kirishima',
  title: 'Kirishima',
  description: 'A blog about the life of Kirishima',
  url: siteUrl,
  author: {
    name: 'Kirishima',
    bio: '我是 Kirishima，普通高中生，随便整点小爱好。开这个博客，主要是给阅读和想法找一个能留下来的地方。',
    email: 'aeschylus.dodgy050@passinbox.com',
  },
  locale: 'zh-cn',
  locales: ['zh-cn', 'en'] as const,
  writingPageSize: 8,
  tagIndexThreshold: 1,
  license: {
    name: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  },
  social: [
    { label: 'GitHub', href: 'https://github.com/DataEntity' },
    { label: 'Website', href: 'https://blog.kirishima.dev' },
  ] as Array<{ label: string; href: string }>,
  features: {
    search: true,
    favorites: true,
    theme: true,
    rss: true,
    share: true,
    tips: false,
    newsletter: false,
    comments: false,
  },
} as const;

export type Locale = (typeof site.locales)[number];

---
# =============================================================================
# writing 示例 · frontmatter 字段说明
# 本文件 draft: true，不会出现在公开列表 / RSS。
# 复制后改字段，删掉不需要的行即可；未写的字段会用下方「默认」值。
# 来源：src/content.config.ts
# =============================================================================

# --- 必填 ---
title: "写作 frontmatter 示例"
description: "说明 writing 集合各 YAML 字段含义、是否必填与默认值。复制本文件新建文章时可对照。"

# 语言：仅允许 zh-cn | en。默认 zh-cn
locale: zh-cn

# 发布日期（必填）。可用 YYYY-MM-DD；决定 URL 中的 /writing/年/月/
publishedAt: 2026-01-01

# --- 常用可选 ---

# 更新日期。省略则列表排序用 publishedAt
# updatedAt: 2026-01-02

# 作者。省略时详情页等处可能回退到站点作者
author: Kirishima

# 标签：横向浏览 /tags/。默认 []
tags:
  - example
  - meta

# 精选：首页等「精选」位。默认 false
featured: false

# 草稿：true 时不进入公开索引、RSS、专栏公开列表。默认 false
# 本示例保持 true，避免污染站点
draft: true

# 阅读时长（分钟，正数）。省略则页面可不显示
# minutes: 5

# 是否开启该篇评论（站点 features.comments 仍需打开）。默认 false
comments: false

# --- 专栏（连续阅读路径）---
# column 必须与 src/content/columns/*.md 里的 title 完全一致
# columnOrder 为专栏内顺序（1, 2, 3…）
# 挂上专栏后，文章仍会出现在「写作」列表；专栏页只是按顺序另列一次
# column: 三日
# columnOrder: 1

# --- SEO / 社交 ---
# seoTitle: "自定义浏览器标题（可选）"
# canonical: https://blog.kirishima.dev/writing/2026/01/example/
# ogImage: /assets/heroImage-02.jpg

# --- 多语言预留 ---
# 同一内容不同语言可用同一 translationKey 关联；路由尚未完整接好
# translationKey: writing-frontmatter-example

# --- 其它 common 字段 ---
# order: 0          # 通用排序权重，writing 列表主要按日期；默认 0
---

## 怎么用

1. 复制本文件到对应分类目录（如 `Vignettes/2026/09/`）。
2. 改文件名与 `title` / `description` / `publishedAt`。
3. 按需保留 `tags`、`column` 等；不需要的键直接删除。
4. 把 `draft` 改成 `false` 才会公开。

公开 URL 只取决于 **文件名（basename）** 和 `publishedAt` 的年月，**不取决于** 文件夹路径：

`writing/Reflexion/2026/04/foo.md` → `/writing/2026/04/foo/`

---

## 字段速查（writing）

| 字段 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | 是 | — | 标题 |
| `description` | 是 | — | 摘要 / dek |
| `locale` | 否* | `zh-cn` | `zh-cn` \| `en`（校验仍要求有值） |
| `publishedAt` | 是 | — | 发布日，进 URL |
| `updatedAt` | 否 | — | 更新日期 |
| `author` | 否 | — | 作者 |
| `tags` | 否 | `[]` | 标签 |
| `featured` | 否 | `false` | 精选 |
| `draft` | 否 | `false` | 草稿 |
| `minutes` | 否 | — | 阅读分钟 |
| `comments` | 否 | `false` | 本篇评论开关 |
| `column` | 否 | — | 专栏 **title** 字符串 |
| `columnOrder` | 否 | — | 专栏内篇序 |
| `seoTitle` | 否 | — | SEO 标题 |
| `canonical` | 否 | — | 规范 URL |
| `ogImage` | 否 | — | OG 图路径（如 `/assets/...`） |
| `translationKey` | 否 | — | 跨语言关联键 |
| `order` | 否 | `0` | 通用排序权重 |

---

## 其它集合（对照）

### columns（专栏页本身）

| 字段 | 说明 |
| --- | --- |
| `title` | 与文章里 `column:` 必须一致 |
| `slug` | URL：`/columns/<slug>/` |
| `order` | 专栏列表排序 |
| 另有 | `description`、`locale`、`draft`、`featured`、SEO 等 common 字段 |

正文可写专栏导语；**篇目不写在这里**，由 writing 的 `column` / `columnOrder` 挂入。

### projects

在 common + `publishedAt` 基础上：`status`（默认 `active`：`active` \| `maintained` \| `archived` \| `paused`）、`type`（默认 `project`）、`externalUrl`、`repositoryUrl`、`tags`。

### research

`kind`（默认 `note`）、`version`（默认 `0.1`）、`tags`、`paperUrl`、`codeUrl`。

### photos

必填 `slug`；`cover`；`photos: [{ src, alt, caption? }]`（默认 `[]`）。

### links

必填 `url`；`group`（默认 `常读`）。

---

校验命令：`npm run validate:content`（或 `pnpm` 等价）。

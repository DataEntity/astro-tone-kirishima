type NavItem = {
  label: string;
  href: string;
};

type SiteLicense = {
  /** Short license name shown in the footer, e.g. 'CC BY-NC-SA 4.0'. */
  label: string;
  /** URL to the license deed. Leave empty to hide the license line in the footer. */
  url: string;
};

/**
 * astro-theme-config.ts
 *
 * Central configuration for the Astro Tone theme.
 * Most site-level customization should happen in this file.
 */

const config = {
  site: {
    /** Production origin, used for canonical links, sitemap, and Open Graph metadata. */
    url: 'https://blog.kirishima.dev',
    /** Subpath such as '/repo-name'. Keep empty when deploying at a domain root. */
    base: '',
    lang: 'en',
    locale: 'en_US',
    dateLocale: 'en-US',
    title: 'Kirishima',
    logoLabel: 'KI',
    description: 'A blog about the life of Kirishima',
    author: 'Kirishima',
    /** Optional absolute or root-relative image URL for homepage/search/about social previews. */
    defaultOgImage: '/og.png',
  },

  /** Default content license shown in the site footer. */
  license: {
    label: 'CC BY-NC-SA 4.0',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  } satisfies SiteLicense,

  // The logo already links to `/`. Add items here if you want visible header links.
  // Example: [{ label: 'Blog', href: '/blog' }, { label: 'About', href: '/about' }]
  nav: [] as NavItem[],

  // Footer links stay visible by default so readers have a stable way to move around.
  footerNav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Search', href: '/search' },
  ] as NavItem[],

  content: {
    categoryOrder: [
      'Design',
      'Getting Started',
      'Markdown',
      'Open Source',
      'Systems',
      'Notes',
      'Research',
      'Performance',
      'MDX',
    ],
  },

  behavior: {
    smoothScroll: true,
  },

  comments: {
    // One-line switch after you fill the giscus values:
    // mode: 'off'           -> no comments
    // mode: 'giscus'        -> original giscus theme
    // mode: 'giscus-custom' -> Astro Tone custom giscus theme
    // Local preview can also use PUBLIC_GISCUS_MODE and PUBLIC_GISCUS_* in .env.local.
    mode: 'off',
    provider: 'giscus',
    giscus: {
      repo: '',
      repoId: '',
      category: '',
      categoryId: '',
      mapping: 'pathname',
      strict: '0',
      reactionsEnabled: '0',
      emitMetadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      customLightTheme: '/giscus-light.css',
      customDarkTheme: '/giscus-dark.css',
      lang: 'en',
      loading: 'eager',
    },
  },

  social: {
    website: 'https://blog.kirishima.dev',
    email: 'aeschylus.dodgy050@passinbox.com',
    linkedin: '',
    github: 'https://github.com/DataEntity',
  },

  about: {
    /** Profile image URL. Leave empty to use the text-only About layout. */
    profileImage: '',
    name: 'Kirishima',
    role: '普通高中生',
    location: '',
    focus: '閱讀札記、論證拆解、還沒想完的念頭',
    lead: '我是 Kirishima，普通高中生，隨便整點小愛好。開這個博客，主要是給閱讀和想法找一個能留下來的地方。',
    headline: ['留下來，', '再拆一遍。'],
    statementLabel: '關於我',
    statementTitle: '不太相信記憶，也不太相信直覺。',
    statement:
      '我不太相信記憶，所以把閱讀留下來；也不太相信直覺，所以拆解論證結構。於此記錄思考碎片，方便之後回顧，以至於批判當時的想法。實際上只是一些亂七八糟思考的存放點，可能會有很多錯誤，也可能會有很多重複。',
    careerLabel: '本站',
    careerHeading: '關於本站與使用聲明',
    career: [
      {
        period: '內容',
        title: '更像筆記本',
        description:
          '這裡會放閱讀札記、隨手記下的片段，以及一些還沒想完、但暫時不想丟掉的念頭。更新不固定，質量也不保證均勻，所以更像個人筆記本，而不是正式出版物。',
      },
      {
        period: '聲明',
        title: 'CC BY-NC-SA 4.0',
        description:
          '本博客由 Kirishima 維護，默認採用 CC BY-NC-SA 4.0。涉及政治、宗教、翻譯學習作品等敏感話題的內容屬於未授權，請勿轉載。本人無強烈意識形態，旨在和平交流。',
      },
    ],
    interests: [
      '技术宅',
      '维基人',
      'manga愛好',
      'homelab',
      'Colemak-DH',
      'WebDev',
      'RSS',
      '开源工具链',
    ],
    interestsLabel: 'Tags',
    interestsHeading: '不喜歡介紹自己，所以留幾個詞。',
  },
};

export default config;

// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const pkg = require('../package.json');
const DOCS_BASE_URL = process.env.DOCS_BASE_URL || '/';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'NLP.js Docs',
  tagline: 'NLP.js documentation site',
  url: process.env.DOCS_GITHUB_URL || 'https://pages.github.com',
  // baseUrl: '/axa-group/nlp.js/',
  baseUrl: DOCS_BASE_URL,
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  trailingSlash: false,

  // GitHub pages deployment config.
  organizationName: process.env.DOCS_GITHUB_ORG || 'axa-group',
  projectName: process.env.DOCS_GITHUB_PROJECT || 'nlp.js',

  deploymentBranch: 'gh-pages',
  githubHost: 'github.com',
  customFields: {
    githubURL: pkg.repository.url,
    githubBranch: process.env.DOCS_BRANCH || 'master',
  },

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [[require.resolve('@cmfcmf/docusaurus-search-local'), { indexBlog: false }]],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          lastVersion: 'current',
          versions: {
            current: {
              label: 'v4 (current)',
              path: '/',
            },
            v3: { 
              label: 'v3',
              path: '/v3',
            },
          },
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'NLP.js Docs',
        logo: {
          alt: 'AXA Docs Logo',
          src: 'img/axa.svg',
        },
        items: [
          {
            href: 'https://github.com/axa-group/nlp.js',
            label: 'AXA GitHub',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} AXA Group Operations`,
      },
      docs: {
        sidebar: {
          hideable: true,
        },
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['yaml', 'mongodb'],
      },
    }),
};

module.exports = config;

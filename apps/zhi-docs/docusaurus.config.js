// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github")
const darkCodeTheme = require("prism-react-renderer/themes/dracula")
const docsConfig = require("./docs.config")

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Zhi framework",
  tagline: "The ultimate framework for building blog and theme",
  url: "https://terwer.space",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "terwer", // Usually your GitHub org/user name.
  projectName: "zhi", // Usually your repo name.

  // https://github.com/tgreyuk/typedoc-plugin-markdown/tree/master/packages/docusaurus-plugin-typedoc#readme
  plugins: docsConfig.plugins,

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/terwer/zhi/edit/main/apps/zhi-docs/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: "https://github.com/terwer/zhi/edit/main/apps/zhi-docs/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: "Zhi",
        logo: {
          alt: "Zhi Logo",
          src: "img/logo-small.svg",
        },
        items: [
          { to: "/docs/zhi", label: "Api", position: "left" },
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/terwer/zhi",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Api",
                to: "/docs/zhi",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Stack Overflow",
                href: "https://stackoverflow.com/questions/tagged/docusaurus",
              },
              {
                label: "Discord",
                href: "https://discordapp.com/invite/docusaurus",
              },
              {
                label: "Twitter",
                href: "https://twitter.com/docusaurus",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "Blog",
                to: "/blog",
              },
              {
                label: "GitHub",
                href: "https://github.com/terwer/zhi",
              },
            ],
          },
        ],
        copyright: `Copyright © 2011 - ${new Date().getFullYear()} Terwer, Inc. Built with <a href="https://docusaurus.io/" target="_blank">Docusaurus</a> .`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config

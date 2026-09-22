[中文](README_zh_CN.md)

# Publisher

<img alt="logo" width="160" height="160" src="./icon.png"/>

> Publish and update SiYuan articles across platforms.

Publisher is built for people who write in SiYuan and also maintain blogs, knowledge bases, or static sites. Configure platform accounts once, publish from the current document, and update the published article later when the document changes.

## Core features

- **Quick publish** — open a SiYuan document, choose a platform, and publish.
- **Continuous updates** — after publishing, update the same platform article when the document changes.
- **Image handling** — choose no upload, platform built-in upload, or Publisher’s bundled PicGo core (`zhi-siyuan-picgo` headless lib) per platform; PicGo-core upload does not require installing the standalone `siyuan-plugin-picgo` plugin product.
- **Configure once** — validate and save platform accounts, then reuse them for future publishing.
- **Multiple targets** — publish to blogs, knowledge bases, static-site repositories, web-login platforms, and local folders.
- **Unified interface** — platform setup, quick publish, publishing status, and error details stay in one interface.

## Featured capabilities

### Publishing workspace

**The workspace is the new entry point of Publisher, organized around the current document.**

1. Add and validate platform accounts in **Publishing Settings**.
2. Open the SiYuan document you want to publish.
3. Choose a platform in **Quick Publish**, then publish or update the article.

After publishing, you can view publishing status, open the published article, or remove publishing records from the same place. When setup or publishing fails, Publisher tries to show readable error details.

## Quick start

1. Install and enable **Publisher** from the SiYuan marketplace.
2. Open Publisher from the SiYuan toolbar.
3. Add a platform account in **Publishing Settings**, then validate and save it.
4. Open the document you want to publish, go to **Quick Publish**, choose a platform, and publish.

> The interface is the native panel. **The previous interface was removed entirely in `2.0.0`**, so this release ships no way back to it; if you really need it, install the last release that had it, `1.41.1` (Settings → About keeps that download link, scheduled for removal in `2.3.0`).

### What changed in 2.0.0

- **The previous interface is gone**: the old toolbar menu, the old settings pages and the embedded iframe UI are all removed, along with the switch that went back to them.
- **The browser extension, widget and web builds were rebuilt**: all three now use the same interface. The extension and the web build ask for your SiYuan API address and token under Connection settings on first use; the widget shares the host origin and needs neither.
- **Your platform accounts are untouched**: accounts, platform settings and published links keep the storage they already had, so nothing needs reconfiguring after the upgrade.
- **One source of copy**: the two parallel translation sets are merged into one and the languages are fully aligned.

![](./docs/images/publisher-icon.png)

## Platform directions

- **Content platforms / knowledge bases**: Yuque, Notion, Halo, Confluence, and more.
- **Blogs**: Cnblogs, WordPress, Typecho, Jvue, and more.
- **Static-site repositories**: GitHub / GitLab for Hexo, Hugo, Jekyll, Quartz, VuePress, VitePress, Astro, and similar sites.
- **Web-login platforms**: selected platforms that publish through an existing web login session.
- **Local folders**: export to a local directory on the desktop client for further processing by other tools.

Platform capabilities continue to improve with each version. Check the in-plugin platform list and documentation for details.

## Documentation

[Read the Publisher docs](https://siyuan.wiki/s/20240330142711-bc3gjg0)

## Changelog

[CHANGELOG](CHANGELOG.md)

## Community and history

[QQ 722632752](https://qm.qq.com/cgi-bin/qm/qr?k=fYrA79XDvtr4JuEgez-dmj1h3tOef8pg&jump_from=webapi&authKey=DC+XcjkoTH762jxvkSgpt7V97QFETnaLVTZIWhd8PdZoX+MNSr+LsprWFYYELXu8) · [More SiYuan plugins](https://github.com/terwer/zhi/blob/main/README.md#plugins) · [Archived README files](docs/archive/README.md)

Thanks to SiYuan, Vue, Vite, TypeScript, and the open-source projects behind this plugin, and to everyone who tests, reports issues, and supports Publisher.

## License

[GPL-3.0](LICENSE)

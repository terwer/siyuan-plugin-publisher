# DEVELOPMENT

This file is the single source of truth for contributors.  
All developer information should live here.

---

## Requirements

- **Node.js** (current LTS recommended)  
- **pnpm** (package manager)  

Make sure both are installed before starting development.

---

## Tech Stack

- Language: TypeScript  
- Build: Vite + pnpm  
- UI: Single-page app (hash-based routes like `/#/manage`)  
- Host: SiYuan plugin framework  

---

## Getting Started

Run these commands in your dev environment:

    pnpm install        # install dependencies
    pnpm dev            # run dev server
    # open http://localhost:5173/#/manage
    pnpm build          # build for production

- During development, you can load the plugin in SiYuan by pointing it at your build output.  
- The dev server shows the Manage UI outside of SiYuan for faster iteration.  

---

## Project Layout

    src/
      platforms/    # provider implementations (GitHub, GitLab, Gitea, etc.)
      core/         # core logic: note → markdown, front matter
      images/       # image upload adapters (direct / PicGo)
      ui/           # SPA routes and components
    docs/           # user documentation

---

## Routes

- `/#/manage` → Management UI (provider setup, repo/token configuration, image pipeline).  

---

## Provider API

Providers must implement a common shape:

    interface PublishProvider {
      id: string;
      label: string;
      supportsImages: boolean;
      upsertText(opts): Promise<UpsertResult>;
      uploadImage?(opts): Promise<UploadResult>;
    }

- `upsertText`: create or update Markdown content.  
- `uploadImage`: optional — upload images for posts.  

---

## Image Handling

- **Direct mode**: upload binary files into repo at `static/img/...`  
- **PicGo mode**: delegate upload to PicGo for external storage/CDN  

---

## Front Matter

By default, the plugin generates YAML front matter:

    ---
    title: "Post Title"
    date: 2025-10-03T12:00:00-04:00
    slug: "post-title"
    draft: false
    tags: []
    categories: []
    ---

- Compatible with Hugo, Hexo, and most static site generators.  

---

## Contributing a New Provider

1. Add `src/platforms/<provider>.ts`.  
2. Register it in the provider registry.  
3. Add a UI schema for configuration fields.  
4. Document it in `docs/CONFIGURATION.md`.  

---

## Testing

- Run unit tests for markdown/front matter conversion.  
- Test publishing to a sandbox repo with your provider.  
- Use lint/format scripts:

      pnpm lint
      pnpm test

---

## Release Process

1. Update version in `package.json`.  
2. Build assets:

       pnpm build

3. Update docs (README.md / README.zh-CN.md).  
4. Commit and tag a release.  

---

## Documentation Maintenance

- All developer info stays here.  
- User docs live in `/docs`.  
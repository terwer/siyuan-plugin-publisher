# User Guide

## Manage UI (`/#/manage`)

The Publisher plugin uses a single-page app (SPA) for its interface.  
The **Manage UI** is at the route `/#/manage`.

- Inside SiYuan: you don’t need to type this URL — the plugin panel automatically loads it.
- In dev mode (`pnpm dev`): you can open `http://localhost:5173/#/manage` in your browser to see the same interface.

## Basic Workflow

1. Install the plugin in SiYuan.
2. Open the plugin panel → **Manage**.
3. Configure a provider:
    - Token (PAT)
    - Owner/Repo
    - Branch
    - Content directory (e.g. `content/posts`)
    - Images directory (e.g. `static/img`)
4. Save settings.
5. Select a note in SiYuan and click **Publish**.

## Drafts

- Front matter includes a `draft` field.
- Toggle it via the UI or set it manually in the YAML.

## Images

You can choose how images are handled:
- **Direct upload to the repo** (files stored in the repo’s image directory).
- **PicGo integration** (uploads to external object storage or CDN).

## Tips

- Check that your repo paths (`content/posts`, `static/img`) exist.
- Tokens must have write access to the repository.
- If publishing fails, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).  

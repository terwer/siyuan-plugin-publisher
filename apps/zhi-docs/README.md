# zhi-docs

docs for zhi framework

This website is built using [Docusaurus 2](https://docusaurus.io/), a modern static website generator.

### Installation

```
pnpm install -F zhi-docs
```

### Local Development

```
pnpm dev -F zhi-docs
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
pnpm build -F zhi-docs
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
cd apps/zhi-docs
USE_SSH=true pnpm deploy
```

Not using SSH:

```
cd apps/zhi-docs
GIT_USER=<Your GitHub username> pnpm deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
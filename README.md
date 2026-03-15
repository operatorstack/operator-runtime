# operator-runtime

**Operator architecture for reliable automation systems.**

This repo now includes a Docusaurus documentation site for the TypeScript SDK and keeps the SDK source, examples, and tests in the same project.

Because the SDK root package is ESM (`"type": "module"`) and Docusaurus does not currently build reliably from the repo root config, the Docusaurus site config lives in `website/` while the main docs content stays in `docs/`. The root scripts call Docusaurus with `website` as the explicit site directory.

## Docs Site

Run the docs locally:

```bash
npm install
npm start
```

This serves the docs at:

```text
http://127.0.0.1:3001/operator-runtime/
```

Build the docs site:

```bash
npm run build
```

Serve the built site locally:

```bash
npm run serve
```

The docs content lives in `docs/`.

The Docusaurus site config lives in `website/`, with:

- config in `website/docusaurus.config.ts`
- sidebar structure in `website/sidebars.ts`
- homepage in `website/src/pages/index.tsx`

If the dev server gets into a bad generated-cache state, reset it with:

```bash
npm run docs:clear
```

## GitHub Pages Deployment

This repo is configured for GitHub Pages with:

- `url`: `https://operatorstack.github.io`
- `baseUrl`: `/operator-runtime/`
- `organizationName`: `operatorstack`
- `projectName`: `operator-runtime`

Deploy with:

```bash
GIT_USER=<your-github-username> npm run deploy
```

If you use SSH for GitHub:

```bash
USE_SSH=true GIT_USER=<your-github-username> npm run deploy
```

## SDK Commands

Build the SDK:

```bash
npm run sdk:build
```

Type-check the SDK:

```bash
npm run sdk:check
```

Run tests:

```bash
npm test
```

## Examples

Run the Hacker News browser example:

```bash
npm run example:hacker-news
```

To watch the browser open:

```bash
HEADED=1 npm run example:hacker-news
```

If you need to point Playwright at a specific local browser:

```bash
OPERATOR_RUNTIME_BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run example:hacker-news
```

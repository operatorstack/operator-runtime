# operator-runtime

An operator execution layer for reliable automation systems.

`operator-runtime` is the operator layer. It is not a browser runtime.

The operator layer is responsible for:

- receiving a task or goal
- selecting a capability
- passing context and runtime into an engine
- applying capability-level and run-level verification
- returning a result and execution trace

## Core model

- `goal`: the task description for the run
- `capability`: the bounded task domain
- `context`: structured execution input
- `runtime`: execution resources and state
- `engine`: the executor
- `verify`: deterministic acceptance logic
- `trace`: the record of what happened

Mental model:

```text
Operator
  ↓
Engine
  ↓
Runtime
  ↓
Environment
  ↓
Verification
  ↓
Result + Trace
```

Important distinctions:

- capabilities are operator-level task domains
- runtime methods are not capabilities
- context is not prompt text
- runtime holds resources
- engine performs execution
- verification defines deterministic acceptance boundaries

## Scripts

```bash
npm install
npm run build:sdk
npm run check
npm run example:sequence
```

## Claude example

`operator-runtime` can also run a real Claude-backed extraction example on top of a Playwright browser runtime.

This is not deterministic automation. It is:

- deterministic operator orchestration
- Claude-backed extraction
- deterministic verification

Run it with:

```bash
ANTHROPIC_API_KEY=... ANTHROPIC_MODEL=claude-3-haiku-20240307 npm run example:claude-hn
```

If you need to point Playwright at a specific local browser:

```bash
OPERATOR_RUNTIME_BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ANTHROPIC_API_KEY=... ANTHROPIC_MODEL=claude-3-haiku-20240307 npm run example:claude-hn
```

## Docs site

The docs content lives in `docs/` and the Docusaurus site config lives in `website/`.

Run the docs locally:

```bash
npm start
```

This serves the docs at:

```text
http://127.0.0.1:3001/operator-runtime/
```

Build the docs site:

```bash
npm run docs:build
```

Deploy the docs with GitHub Pages:

1. In GitHub, open `Settings -> Pages`.
2. Set the source to `GitHub Actions`.
3. Push the branch to GitHub and merge it into `main`.
4. The `Deploy docs` workflow will publish `website/build` to Pages.

Serve the built docs locally:

```bash
npm run docs:serve
```

If the dev server gets into a bad generated-cache state, reset it with:

```bash
npm run docs:clear
```

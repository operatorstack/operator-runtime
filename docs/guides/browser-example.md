---
title: Browser Example
---

# Browser Example

This guide walks through the current Playwright-backed vertical slice in the repo.

## Why this exists

The browser example proves the operator model against a real execution environment:

- a real browser page
- a real capability
- a real engine
- deterministic verification
- a real trace

## How it works

The current example script lives at `src/examples/browser-hacker-news.ts`.

The pieces are:

- capability: `browser.extract_hacker_news_top_story`
- context: `{ url }`
- runtime: `{ page }`
- engine: Playwright-backed browser executor
- verification: title and URL checks

## Example

Run the example:

```bash
npm run example:hacker-news
```

To watch the browser:

```bash
HEADED=1 npm run example:hacker-news
```

## Notes

:::info Current
This is the strongest current vertical slice in the repo because it uses a real browser runtime instead of a fake sequence runtime.
:::

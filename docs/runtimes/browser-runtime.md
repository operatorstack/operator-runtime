---
title: Browser Runtime
---

# Browser Runtime

The browser runtime is the most concrete runtime in the repo today.

## Why this exists

Many automation tasks need real browser state:

- a current page
- navigation state
- locators
- cookies and session state

## How it works

In the current examples, runtime is:

```ts
type BrowserRuntime = {
  page: Page;
};
```

The engine uses `runtime.page` to navigate and extract values.

## Example

The current Hacker News example uses a browser runtime to:

1. open Hacker News
2. locate the first story link
3. extract the title and URL
4. verify the result deterministically

## Notes

:::info Current
The repo currently includes a working browser-backed example and a browser-backed integration test using Playwright.
:::

:::warning Common confusion
The browser runtime is a resource container. It is not the capability and it is not the engine.
:::

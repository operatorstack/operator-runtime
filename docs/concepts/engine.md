---
title: Engine
---

# Engine

The engine performs execution.

It is the part of the system that actually does the work with the available runtime resources.

## Why this exists

Separating the engine from the operator lets you reuse the same operator contract across different execution strategies:

- deterministic sequence engines
- browser engines using Playwright
- future LLM-backed engines

## How it works

An engine implements `run(input)` and receives:

- the selected capability
- the current attempt number
- optional context
- optional runtime
- the current trace

## Example

```ts
const browserEngine: OperatorEngine<BrowserCapabilities> = {
  async run(input) {
    await input.runtime.page.goto(input.context.url, {
      waitUntil: "domcontentloaded",
    });

    return {
      title: await input.runtime.page.title(),
      url: input.runtime.page.url(),
    };
  },
};
```

## Notes

:::warning Common confusion
The engine is the executor. The runtime is what the executor uses.
:::

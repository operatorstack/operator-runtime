---
title: Context
---

# Context

Context is structured execution input.

It is not prompt text. It is not hidden instructions. It is the data the engine needs to run the task.

## Why this exists

Separating context from prompts keeps the API explicit and testable.

Examples of context:

- `url`
- `accountId`
- `invoiceId`
- `insurer`

## How it works

Context is passed into `operator.execute()` and then forwarded into the engine through `EngineRunInput`.

## Example

```ts
context: {
  url: "https://news.ycombinator.com/",
}
```

## Notes

:::warning Common confusion
Context is structured execution input, not prompt engineering.
:::

:::info Current
The current browser example uses `context.url` to tell the engine which page to open.
:::

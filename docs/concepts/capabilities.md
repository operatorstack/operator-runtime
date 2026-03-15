---
title: Capabilities
---

# Capabilities

Capabilities are bounded task domains.

They describe what kind of run is happening, not which low-level methods the engine will call.

## Why this exists

Capabilities give the system semantic structure. They let the operator say:

- this run is invoice extraction
- this run is session capture
- this run is Hacker News top-story extraction

## How it works

A capability usually contains:

- a stable name
- optional metadata
- optional default verification

Examples:

- `automation.extract_invoice`
- `automation.capture_session`
- `browser.extract_hacker_news_top_story`

## Example

```ts
const capabilities = createCapabilityRegistry({
  "browser.extract_hacker_news_top_story": defineCapability({
    name: "browser.extract_hacker_news_top_story",
    defaultVerify(result) {
      return {
        passed: typeof result.title === "string" && result.title.length > 0,
        violations: [],
      };
    },
  }),
});
```

## Notes

:::warning Common confusion
Capabilities are bounded task domains, not low-level browser actions.
:::

:::info Current
The current implementation provides `defineCapability()` and `createCapabilityRegistry()` for capability definition and registration.
:::

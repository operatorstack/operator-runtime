---
title: Capability API
---

# Capability API

This page describes the current capability definition helpers.

## Why this exists

Capabilities are declared through small helper functions so the task-domain contract stays explicit.

## How it works

Current capability definition shape:

```ts
type CapabilityDefinition<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
> = {
  name: string;
  description?: string;
  defaultVerify?: Verifier<TOutput>;
  metadata?: Record<string, unknown>;
};
```

Current helpers:

```ts
defineCapability(capability)
createCapabilityRegistry(capabilities)
normalizeVerifyResult(result, source)
```

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
Capability APIs describe task-domain contracts. They do not expose browser methods.
:::

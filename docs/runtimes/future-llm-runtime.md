---
title: Future LLM Runtime (WIP)
---

# Future LLM Runtime (WIP)

This page describes a future runtime direction, not a current implementation.

## Why this exists

The operator model is designed so different engines and runtimes can sit behind the same contract. An LLM-backed runtime is one possible future direction.

## How it would work

A future LLM runtime would likely provide:

- model access
- tool access
- execution memory for the run
- structured result production

The engine would still be the executor. The runtime would still be resources and state.

## Example

A future run might look like:

```ts
await operator.execute({
  goal,
  capability,
  context,
  runtime: {
    model,
    toolset,
  },
  verify,
});
```

## Notes

:::caution WIP
There is no full LLM runtime implementation in this repo today.
:::

:::warning Common confusion
An LLM runtime would still not change what a capability is. Capability is task-domain meaning. Runtime is execution resources.
:::

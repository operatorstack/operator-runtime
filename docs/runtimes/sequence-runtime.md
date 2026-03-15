---
title: Sequence Runtime
---

# Sequence Runtime

The sequence runtime is a deterministic test-style runtime pattern.

## Why this exists

A sequence runtime is useful when you want to verify:

- retry behavior
- verifier behavior
- trace recording
- deterministic result progression

without involving a browser or external system.

## How it works

A simple sequence runtime can expose:

```ts
type SequenceRuntime<TOutput> = {
  nextResult: (attempt: number) => TOutput;
};
```

The engine asks the runtime for the next result for each attempt.

## Example

This docs site includes a sequence runtime example in the examples section to show the architecture clearly.

## Notes

:::info Current
The current repo runtime supports this pattern, but it does not currently ship a checked-in sequence runtime module or runnable sequence example script.
:::

:::warning Common confusion
Sequence runtime is still a runtime. It supplies deterministic resources and state for execution. It is not the capability.
:::

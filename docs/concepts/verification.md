---
title: Verification
---

# Verification

Verification is deterministic acceptance logic.

## Why this exists

The system needs a clear answer to one question:

Is this candidate result acceptable?

Verification gives that answer in code.

## How it works

The current runtime supports:

- boolean verifier results
- structured verifier results with `passed`, `reason`, and `violations`

It also supports two layers:

- capability default verification
- per-run `verify`

## Example

```ts
verify(result) {
  if (result.title.includes("Example")) {
    return true;
  }

  return {
    passed: false,
    reason: `Unexpected title: ${result.title}`,
  };
}
```

## Notes

:::warning Common confusion
Verification is deterministic acceptance logic, not vague scoring.
:::

:::info Current
The current implementation normalizes boolean and structured verifier results into one internal trace-friendly format.
:::

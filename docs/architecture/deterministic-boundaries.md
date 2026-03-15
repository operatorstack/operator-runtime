---
title: Deterministic Boundaries
---

# Deterministic Boundaries

Verification is the acceptance boundary for the system.

The operator does not need to specify the solution. The operator needs to specify the goal and a deterministic way to verify success.

## Why this exists

Without a deterministic acceptance boundary, a run can look plausible while still being wrong.

Verification gives the runtime a clear condition:

- if verification passes, the result is accepted
- if verification fails, the runtime retries or fails

## How it works

There are two verification layers:

- capability default verification
- per-run `verify`

Capability default verification usually handles structural checks:

- required fields exist
- types are correct
- basic schema constraints hold

Per-run `verify` handles domain acceptance:

- amount must be greater than zero
- title must contain expected text
- result URL must match the intended domain

## Example

```ts
verify(result) {
  const passed =
    result.title.length > 5 &&
    result.url.startsWith("http") &&
    result.sourceURL.includes("news.ycombinator.com");

  if (passed) {
    return {
      passed: true,
    };
  }

  return {
    passed: false,
    reason: `Unexpected Hacker News result: ${JSON.stringify(result)}`,
  };
}
```

## Notes

:::warning Common confusion
Verification is not a vague quality signal. It is deterministic acceptance logic.
:::

:::info Current
The current runtime normalizes boolean and structured verifier outputs into one internal verification shape before writing the trace.
:::

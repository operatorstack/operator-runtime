---
title: Verification Patterns
---

# Verification Patterns

Verification should stay deterministic and boring.

## Why this exists

If acceptance logic is weak, the runtime can pass bad results.

## How it works

Use default capability verification for:

- required fields
- type checks
- basic schema invariants

Use per-run `verify` for:

- page-specific expectations
- domain-specific invariants
- run-specific acceptance rules

## Example

Good per-run verification:

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

- Keep verification deterministic.
- Return a useful `reason` when failing.
- Let capability verification guard structure first.

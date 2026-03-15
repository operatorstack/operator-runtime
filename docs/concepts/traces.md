---
title: Traces
---

# Traces

Traces are the execution record returned by the runtime.

## Why this exists

You need to know more than whether the run succeeded. You need to know:

- how many attempts happened
- what result was produced on each attempt
- which verifier rejected or accepted the result
- why a failure happened

## How it works

The current trace includes:

- `goal`
- `capability`
- `startedAt`
- `finishedAt`
- `status`
- `attempts`
- `failureReason`

Each attempt records:

- the candidate `result`
- capability verification outcome
- operator verification outcome
- accepted or rejected status

## Example

```ts
console.log(execution.trace.status);
console.log(execution.trace.attempts);
```

## Notes

:::info Current
The checked-in browser integration test asserts both the accepted result and the trace contents.
:::

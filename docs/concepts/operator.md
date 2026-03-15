---
title: Operator
---

# Operator

The operator is the public execution boundary of the SDK.

## Why this exists

The operator gives callers one place to declare:

- what they want
- which task domain applies
- what execution input is needed
- what runtime resources are available
- how success should be verified

## How it works

The current API shape is:

```ts
const execution = await operator.execute({
  goal,
  capability,
  context,
  runtime,
  verify,
});
```

The operator coordinates the run and returns:

- `result`
- `trace`
- `capability`
- `attemptCount`

## Example

```ts
const operator = createOperator({
  engine: browserEngine,
  capabilities,
});
```

## Notes

:::info Current
The repo currently implements `createOperator()` and `operator.execute()` as the main public runtime surface.
:::

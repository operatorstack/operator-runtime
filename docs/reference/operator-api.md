---
title: Operator API
---

# Operator API

This page describes the current operator-facing API.

## Why this exists

`createOperator()` and `operator.execute()` are the main entry points for building runs.

## How it works

Current operator creation:

```ts
type CreateOperatorOptions<TCapabilities extends CapabilityMap> = {
  engine: OperatorEngine<TCapabilities>;
  capabilities: TCapabilities;
  retryPolicy?: Partial<RetryPolicy>;
};
```

Current execution input:

```ts
type OperatorExecuteInput<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
  TCapability extends string = string,
> = {
  goal: string;
  capability: TCapability;
  context?: TContext;
  runtime?: TRuntime;
  verify?: Verifier<TOutput>;
};
```

Current execution result:

```ts
type OperatorExecuteResult<TOutput> = {
  result: TOutput;
  trace: ExecutionTrace<TOutput>;
  capability: string;
  attemptCount: number;
};
```

## Example

```ts
const operator = createOperator({
  engine: browserEngine,
  capabilities,
  retryPolicy: {
    maxAttempts: 3,
  },
});
```

## Notes

:::info Current
This page reflects the checked-in TypeScript API in `src/operator.ts` and `src/types.ts`.
:::

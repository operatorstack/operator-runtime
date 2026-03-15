---
title: Extract Invoice
---

# Extract Invoice

This example shows the sequence runtime pattern for a bounded invoice extraction task.

## Why this exists

It is a good example for explaining:

- capability naming
- default verification
- deterministic retry behavior
- domain-specific verification

## How it works

The example below is a pattern example for the current architecture. It is not a checked-in runnable script in the repo today.

## Example

```ts
import {
  createCapabilityRegistry,
  createOperator,
  defineCapability,
  type EngineRunInput,
  type OperatorEngine,
} from "../index.js";

type InvoiceResult = {
  invoiceNumber: string;
  amount: number;
};

type SequenceRuntime<TOutput> = {
  nextResult: (attempt: number) => TOutput;
};

function hasNextResult<TOutput>(
  runtime: unknown,
): runtime is SequenceRuntime<TOutput> {
  if (typeof runtime !== "object" || runtime === null) {
    return false;
  }

  if (!("nextResult" in runtime)) {
    return false;
  }

  return typeof runtime.nextResult === "function";
}

const sequenceEngine: OperatorEngine = {
  async run<
    TOutput,
    TContext = Record<string, unknown>,
    TRuntime = Record<string, unknown>,
  >(
    input: EngineRunInput<TOutput, TContext, TRuntime>,
  ): Promise<TOutput> {
    if (!hasNextResult<TOutput>(input.runtime)) {
      throw new Error("Missing runtime.nextResult");
    }

    return Promise.resolve(input.runtime.nextResult(input.attempt));
  },
};

function createSequenceRuntime<TOutput>(results: TOutput[]): SequenceRuntime<TOutput> {
  return {
    nextResult(attempt) {
      const nextResult = results[attempt - 1] ?? results[results.length - 1];

      if (nextResult === undefined) {
        throw new Error("No sequence result available");
      }

      return nextResult;
    },
  };
}

const capabilities = createCapabilityRegistry({
  "automation.extract_invoice": defineCapability<InvoiceResult>({
    name: "automation.extract_invoice",
    defaultVerify(result) {
      return {
        passed:
          typeof result.invoiceNumber === "string" &&
          typeof result.amount === "number",
        violations: [
          ...(typeof result.invoiceNumber === "string"
            ? []
            : ["Missing invoice number"]),
          ...(typeof result.amount === "number" ? [] : ["Missing amount"]),
        ],
      };
    },
  }),
});

const operator = createOperator({
  engine: sequenceEngine,
  capabilities,
});

const execution = await operator.execute({
  goal: "Extract the invoice from the billing portal",
  capability: "automation.extract_invoice",
  runtime: createSequenceRuntime([
    {
      invoiceNumber: "INV-1024",
      amount: 129.5,
    },
  ]),
  verify(result) {
    const verification = {
      passed: result.amount > 0,
    };

    if (result.amount <= 0) {
      return {
        ...verification,
        reason: "Amount must be greater than zero",
      };
    }

    return verification;
  },
});

console.log(execution.result);
console.log(execution.trace.status);
```

## Notes

:::info Planned
This is a documented pattern example today, not a checked-in runnable invoice example script.
:::

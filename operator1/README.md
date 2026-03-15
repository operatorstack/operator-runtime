# operator1

An operator execution layer for reliable automation systems.

`operator1` is the operator layer. It is not a browser runtime.

The operator layer is responsible for:

- receiving a task or goal
- selecting a capability
- passing context and runtime into an engine
- applying capability-level and run-level verification
- returning a result and execution trace

## Core model

- `goal`: the task description for the run
- `capability`: the bounded task domain
- `context`: structured execution input
- `runtime`: execution resources and state
- `engine`: the executor
- `verify`: deterministic acceptance logic
- `trace`: the record of what happened

Mental model:

```text
Operator
  ↓
Engine
  ↓
Runtime
  ↓
Environment
  ↓
Verification
  ↓
Result + Trace
```

Important distinctions:

- capabilities are operator-level task domains
- runtime methods are not capabilities
- context is not prompt text
- runtime holds resources
- engine performs execution
- verification defines deterministic acceptance boundaries

## Minimal example

```ts
import {
  createCapabilityRegistry,
  createOperator,
  defineCapability,
  type EngineRunInput,
  type OperatorEngine,
} from "operator1";

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
  runtime: {
    nextResult() {
      return {
        invoiceNumber: "INV-1024",
        amount: 129.5,
      };
    },
  },
  verify(result) {
    return result.amount > 0;
  },
});

console.log(execution.result);
console.log(execution.trace.status);
```

## Scripts

```bash
npm install
npm run build
npm run example
```

## Docs

- `docs/architecture.md`
- `docs/execution-model.md`
- `docs/capabilities.md`
- `docs/context.md`
- `docs/runtime.md`
- `docs/verification.md`

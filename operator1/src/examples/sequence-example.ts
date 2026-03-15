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
      const violations: string[] = [];

      if (typeof result.invoiceNumber !== "string") {
        violations.push("Missing invoice number");
      }

      if (typeof result.amount !== "number") {
        violations.push("Missing amount");
      }

      return {
        passed: violations.length === 0,
        violations,
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
    if (result.amount > 0) {
      return true;
    }

    return {
      passed: false,
      reason: "Amount must be greater than zero",
    };
  },
});

console.log("result", execution.result);
console.log("trace", execution.trace.status);

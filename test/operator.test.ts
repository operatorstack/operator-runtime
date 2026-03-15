import { describe, expect, it } from "vitest";

import {
  createCapabilityRegistry,
  createOperator,
  defineCapability,
  type EngineRunInput,
  type OperatorEngine,
} from "../src/index.js";

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

describe("createOperator", () => {
  it("returns an accepted trace when capability and run verification pass", async () => {
    const capabilities = createCapabilityRegistry({
      "automation.extract_invoice": defineCapability<InvoiceResult>({
        name: "automation.extract_invoice",
        defaultVerify(result) {
          return {
            passed:
              typeof result.invoiceNumber === "string" &&
              typeof result.amount === "number",
            violations: [],
          };
        },
      }),
    });
    const operator = createOperator({
      engine: sequenceEngine,
      capabilities,
    });

    const execution = await operator.execute({
      goal: "Extract invoice",
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

    expect(execution.result).toEqual({
      invoiceNumber: "INV-1024",
      amount: 129.5,
    });
    expect(execution.trace.status).toBe("accepted");
    expect(execution.trace.attempts).toHaveLength(1);
    expect(execution.trace.attempts[0]?.accepted).toBe(true);
  });

  it("returns a rejected trace when run verification fails", async () => {
    const capabilities = createCapabilityRegistry({
      "automation.extract_invoice": defineCapability<InvoiceResult>({
        name: "automation.extract_invoice",
      }),
    });
    const operator = createOperator({
      engine: sequenceEngine,
      capabilities,
    });

    const execution = await operator.execute({
      goal: "Extract invoice",
      capability: "automation.extract_invoice",
      runtime: {
        nextResult() {
          return {
            invoiceNumber: "INV-1024",
            amount: 0,
          };
        },
      },
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

    expect(execution.trace.status).toBe("rejected");
    expect(execution.trace.attempts[0]?.runVerification.reason).toBe(
      "Amount must be greater than zero",
    );
  });
});

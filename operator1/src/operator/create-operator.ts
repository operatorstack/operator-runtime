import type { CapabilityRegistry } from "../capabilities/types.js";
import type { VerificationOutcome } from "../trace/types.js";
import type {
  ExecutionResult,
  Operator,
  OperatorEngine,
  VerifyResult,
} from "./types.js";

type NormalizeVerificationInput = VerifyResult | undefined;

function normalizeVerification(
  verification: NormalizeVerificationInput,
): VerificationOutcome {
  if (verification === undefined) {
    return {
      passed: true,
      violations: [],
    };
  }

  if (typeof verification === "boolean") {
    return {
      passed: verification,
      violations: [],
    };
  }

  const normalized: VerificationOutcome = {
    passed: verification.passed,
    violations: Array.isArray(verification.violations)
      ? verification.violations.filter((violation): violation is string => {
          return typeof violation === "string";
        })
      : [],
  };

  if (verification.reason !== undefined) {
    normalized.reason = verification.reason;
  }

  return normalized;
}

export function createOperator<TRegistry extends CapabilityRegistry>(input: {
  engine: OperatorEngine<TRegistry>;
  capabilities: TRegistry;
}): Operator<TRegistry> {
  return {
    async execute(executeInput): Promise<ExecutionResult<any>> {
      const capability = input.capabilities[executeInput.capability];

      if (capability === undefined) {
        throw new Error(`Unknown capability: ${executeInput.capability}`);
      }

      const attempt = 1;
      const engineInput = {
        goal: executeInput.goal,
        capability,
        attempt,
        ...(executeInput.context !== undefined
          ? { context: executeInput.context }
          : {}),
        ...(executeInput.runtime !== undefined
          ? { runtime: executeInput.runtime }
          : {}),
      };
      const result = await input.engine.run(engineInput);
      const capabilityVerification = normalizeVerification(
        capability.defaultVerify === undefined
          ? undefined
          : await capability.defaultVerify(result),
      );
      const runVerification = normalizeVerification(
        executeInput.verify === undefined
          ? undefined
          : await executeInput.verify(result),
      );
      const accepted =
        capabilityVerification.passed && runVerification.passed;

      return {
        result,
        trace: {
          goal: executeInput.goal,
          capability: executeInput.capability,
          status: accepted ? "accepted" : "rejected",
          attempts: [
            {
              attempt,
              result,
              capabilityVerification,
              runVerification,
              accepted,
            },
          ],
        },
      };
    },
  };
}

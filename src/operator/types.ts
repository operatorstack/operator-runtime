import type {
  CapabilityContext,
  CapabilityDefinition,
  CapabilityName,
  CapabilityOutput,
  CapabilityOutputUnion,
  CapabilityRegistry,
  CapabilityRuntime,
  CapabilityRuntimeUnion,
  CapabilityContextUnion,
} from "../capabilities/types.js";
import type { ExecutionTrace } from "../trace/types.js";

export type VerifyResult =
  | boolean
  | {
      passed: boolean;
      reason?: string;
      violations?: string[];
    };

export type RunVerifier<TOutput> = (
  result: TOutput,
) => VerifyResult | Promise<VerifyResult>;

export type EngineRunInput<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
> = {
  goal: string;
  capability: CapabilityDefinition<TOutput, TContext, TRuntime>;
  context?: TContext;
  runtime?: TRuntime;
  attempt: number;
};

export interface OperatorEngine<TRegistry extends CapabilityRegistry = CapabilityRegistry> {
  run(
    input: EngineRunInput<
      CapabilityOutputUnion<TRegistry>,
      CapabilityContextUnion<TRegistry>,
      CapabilityRuntimeUnion<TRegistry>
    >,
  ): Promise<CapabilityOutputUnion<TRegistry>>;
}

export type OperatorExecuteInput<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
  TCapability extends string = string,
> = {
  goal: string;
  capability: TCapability;
  context?: TContext;
  runtime?: TRuntime;
  verify?: RunVerifier<TOutput>;
};

export type ExecutionResult<TOutput> = {
  result: TOutput;
  trace: ExecutionTrace<TOutput>;
};

export type Operator<TRegistry extends CapabilityRegistry> = {
  execute<TName extends CapabilityName<TRegistry>>(
    input: OperatorExecuteInput<
      CapabilityOutput<TRegistry, TName>,
      CapabilityContext<TRegistry, TName>,
      CapabilityRuntime<TRegistry, TName>,
      TName
    >,
  ): Promise<ExecutionResult<CapabilityOutput<TRegistry, TName>>>;
};

import type { VerifyResult } from "../operator/types.js";

export type CapabilityVerifier<TOutput> = (
  result: TOutput,
) => VerifyResult | Promise<VerifyResult>;

export type CapabilityDefinition<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
> = {
  name: string;
  defaultVerify?: CapabilityVerifier<TOutput>;
};

export type CapabilityRegistry = Record<
  string,
  CapabilityDefinition<any, any, any>
>;

export type CapabilityName<TRegistry extends CapabilityRegistry> = Extract<
  keyof TRegistry,
  string
>;

export type CapabilityOutput<
  TRegistry extends CapabilityRegistry,
  TName extends CapabilityName<TRegistry>,
> = TRegistry[TName] extends CapabilityDefinition<
  infer TOutput,
  infer _TContext,
  infer _TRuntime
>
  ? TOutput
  : never;

export type CapabilityContext<
  TRegistry extends CapabilityRegistry,
  TName extends CapabilityName<TRegistry>,
> = TRegistry[TName] extends CapabilityDefinition<
  infer _TOutput,
  infer TContext,
  infer _TRuntime
>
  ? TContext
  : never;

export type CapabilityRuntime<
  TRegistry extends CapabilityRegistry,
  TName extends CapabilityName<TRegistry>,
> = TRegistry[TName] extends CapabilityDefinition<
  infer _TOutput,
  infer _TContext,
  infer TRuntime
>
  ? TRuntime
  : never;

export type CapabilityOutputUnion<TRegistry extends CapabilityRegistry> =
  CapabilityOutput<TRegistry, CapabilityName<TRegistry>>;

export type CapabilityContextUnion<TRegistry extends CapabilityRegistry> =
  CapabilityContext<TRegistry, CapabilityName<TRegistry>>;

export type CapabilityRuntimeUnion<TRegistry extends CapabilityRegistry> =
  CapabilityRuntime<TRegistry, CapabilityName<TRegistry>>;

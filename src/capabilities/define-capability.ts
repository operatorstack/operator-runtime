import type { CapabilityDefinition } from "./types.js";

export function defineCapability<
  TOutput,
  TContext = Record<string, unknown>,
  TRuntime = Record<string, unknown>,
>(
  capability: CapabilityDefinition<TOutput, TContext, TRuntime>,
): CapabilityDefinition<TOutput, TContext, TRuntime> {
  return capability;
}

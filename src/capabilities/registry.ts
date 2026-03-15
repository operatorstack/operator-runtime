import type { CapabilityRegistry } from "./types.js";

export function createCapabilityRegistry<TRegistry extends CapabilityRegistry>(
  capabilities: TRegistry,
): TRegistry {
  return capabilities;
}

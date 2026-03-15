import { describe, expect, it } from "vitest";

import {
  createCapabilityRegistry,
  defineCapability,
} from "../src/index.js";

describe("capability helpers", () => {
  it("returns the provided capability definition unchanged", () => {
    const capability = defineCapability<{
      invoiceNumber: string;
    }>({
      name: "automation.extract_invoice",
    });

    expect(capability.name).toBe("automation.extract_invoice");
  });

  it("returns the provided capability registry unchanged", () => {
    const registry = createCapabilityRegistry({
      "automation.extract_invoice": defineCapability({
        name: "automation.extract_invoice",
      }),
      "automation.capture_session": defineCapability({
        name: "automation.capture_session",
      }),
    });

    expect(Object.keys(registry)).toEqual([
      "automation.extract_invoice",
      "automation.capture_session",
    ]);
  });
});

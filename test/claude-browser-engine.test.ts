import { afterEach, describe, expect, it } from "vitest";

const originalApiKey = process.env.ANTHROPIC_API_KEY;

describe("createClaudeBrowserEngine", () => {
  afterEach(() => {
    if (originalApiKey === undefined) {
      delete process.env.ANTHROPIC_API_KEY;
    } else {
      process.env.ANTHROPIC_API_KEY = originalApiKey;
    }
  });

  it("throws a clear error when ANTHROPIC_API_KEY is missing", async () => {
    delete process.env.ANTHROPIC_API_KEY;

    await expect(async () => {
      const module = await import("../src/engines/claude-browser-engine.js");

      module.createClaudeBrowserEngine();
    }).rejects.toThrow("Missing ANTHROPIC_API_KEY environment variable");
  });
});

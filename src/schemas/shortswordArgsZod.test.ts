import { describe, expect, it } from "vitest";
import { shortswordArgsZod } from "#schemas/shortswordArgsZod.js";

describe("shortswordArgsZod", () => {
  it("should default use-abs-path to false", () => {
    const result = shortswordArgsZod.parse({});

    expect(result["use-abs-path"]).toBe(false);
  });

  it("should allow use-abs-path to be enabled", () => {
    const result = shortswordArgsZod.parse({ "use-abs-path": true });

    expect(result["use-abs-path"]).toBe(true);
  });
});

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

  it("should allow overrides from configuration object", () => {
    const result = shortswordArgsZod.parse({
      overrides: [
        {
          include: ["**/*.test.ts"],
          "max-statements": 6,
          "max-files": 20,
          "use-abs-path": false,
        },
      ],
    });

    expect(result.overrides).toEqual([
      {
        include: ["**/*.test.ts"],
        "max-statements": 6,
        "max-files": 20,
        "use-abs-path": false,
      },
    ]);
  });

  it("should parse overrides from CLI JSON string", () => {
    const result = shortswordArgsZod.parse({
      overrides: JSON.stringify([
        {
          include: ["src/generated/**"],
          exclude: ["**/*.test.ts"],
          "max-statements": 10,
          "use-abs-path": false,
        },
      ]),
    });

    expect(result.overrides).toEqual([
      {
        include: ["src/generated/**"],
        exclude: ["**/*.test.ts"],
        "max-statements": 10,
        "use-abs-path": false,
      },
    ]);
  });

  it("should split comma-separated override glob patterns", () => {
    const result = shortswordArgsZod.parse({
      overrides: [
        {
          include: "**/*.test.ts,**/__tests__/**",
          exclude: "**/*.snap.ts",
        },
      ],
    });

    expect(result.overrides).toEqual([
      {
        include: ["**/*.test.ts", "**/__tests__/**"],
        exclude: ["**/*.snap.ts"],
      },
    ]);
  });

  it("should reject override without include patterns", () => {
    const result = shortswordArgsZod.safeParse({
      overrides: [{ "max-statements": 4 }],
    });

    expect(result.success).toBe(false);
  });

  it("should reject invalid overrides JSON string", () => {
    const result = shortswordArgsZod.safeParse({
      overrides: "[",
    });

    expect(result.success).toBe(false);
  });
});

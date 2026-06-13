import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import pathe from "pathe";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { buildOverrideOptionMaps } from "#modules/options/buildOverrideOptionMaps.js";
import { shortswordArgsZod } from "#schemas/shortswordArgsZod.js";

describe("buildOverrideOptionMaps", () => {
  let rootDir: string;

  beforeEach(async () => {
    rootDir = pathe.join(os.tmpdir(), `shortsword-${randomUUID()}`);
    await fs.mkdir(pathe.join(rootDir, "src", "generated"), { recursive: true });
    await fs.mkdir(pathe.join(rootDir, "src", "internal"), { recursive: true });
    await fs.mkdir(pathe.join(rootDir, "src", "public"), { recursive: true });
    await fs.writeFile(pathe.join(rootDir, "src", "index.ts"), "");
    await fs.writeFile(pathe.join(rootDir, "src", "generated", "schema.ts"), "");
  });

  afterEach(async () => {
    await fs.rm(rootDir, { force: true, recursive: true });
  });

  it("should keep the first matching file override", async () => {
    const config = shortswordArgsZod.parse({
      "use-abs-path": true,
      overrides: [
        {
          include: ["src/**/*.ts"],
          "max-statements": 5,
          "use-abs-path": false,
        },
        {
          include: ["src/index.ts"],
          "max-statements": 10,
        },
      ],
    });
    const result = await buildOverrideOptionMaps({
      rootDir,
      config,
      dirPaths: [pathe.join(rootDir, "src")],
      filePaths: [pathe.join(rootDir, "src", "index.ts")],
    });

    expect(result.fileOptionMap.get(pathe.join(rootDir, "src", "index.ts"))).toEqual({
      "max-statements": 5,
      "use-abs-path": false,
    });
  });

  it("should apply max-files overrides only to directories", async () => {
    const config = shortswordArgsZod.parse({
      overrides: [
        {
          include: ["src/generated"],
          "max-files": 100,
        },
      ],
    });
    const result = await buildOverrideOptionMaps({
      rootDir,
      config,
      dirPaths: [pathe.join(rootDir, "src"), pathe.join(rootDir, "src", "generated")],
      filePaths: [pathe.join(rootDir, "src", "generated", "schema.ts")],
    });

    expect(result.fileOptionMap.size).toBe(0);
    expect(result.directoryOptionMap.get(pathe.join(rootDir, "src", "generated"))).toEqual({
      "max-files": 100,
    });
  });

  it("should exclude directories from max-files overrides", async () => {
    const config = shortswordArgsZod.parse({
      overrides: [
        {
          include: ["src/**"],
          exclude: ["src/internal"],
          "max-files": 20,
        },
      ],
    });
    const result = await buildOverrideOptionMaps({
      rootDir,
      config,
      dirPaths: [
        pathe.join(rootDir, "src"),
        pathe.join(rootDir, "src", "internal"),
        pathe.join(rootDir, "src", "public"),
      ],
      filePaths: [],
    });

    expect(result.directoryOptionMap.has(pathe.join(rootDir, "src", "internal"))).toBe(false);
    expect(result.directoryOptionMap.get(pathe.join(rootDir, "src", "public"))).toEqual({
      "max-files": 20,
    });
  });
});

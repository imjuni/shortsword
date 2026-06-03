import { randomUUID } from "node:crypto";
import fs from "node:fs/promises";
import os from "node:os";
import pathe from "pathe";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { filterFilePathsByGlob } from "#modules/paths/filterFilePathsByGlob.js";

describe("filterFilePathsByGlob", () => {
  let rootDir: string;
  let filePaths: string[];

  beforeAll(async () => {
    rootDir = pathe.join(os.tmpdir(), `shortsword-${randomUUID()}`);
    await fs.mkdir(pathe.join(rootDir, "src", "__tests__"), {
      recursive: true,
    });
    await fs.mkdir(pathe.join(rootDir, "src", "features"), {
      recursive: true,
    });

    filePaths = [
      pathe.join(rootDir, "src", "index.ts"),
      pathe.join(rootDir, "src", "__tests__", "index.test.ts"),
      pathe.join(rootDir, "src", "features", "feature.ts"),
    ];

    await Promise.all(filePaths.map((filePath) => fs.writeFile(filePath, "")));
  });

  afterAll(async () => {
    await fs.rm(rootDir, { force: true, recursive: true });
  });

  it("should return all file paths when include and exclude are omitted", async () => {
    const result = await filterFilePathsByGlob({ rootDir, filePaths });

    expect(result).toEqual(filePaths);
  });

  it("should return only included file paths when include is provided", async () => {
    const result = await filterFilePathsByGlob({
      rootDir,
      filePaths,
      include: ["src/features/**/*.ts"],
    });

    expect(result).toEqual([pathe.join(rootDir, "src", "features", "feature.ts")]);
  });

  it("should remove excluded file paths when exclude is provided", async () => {
    const result = await filterFilePathsByGlob({
      rootDir,
      filePaths,
      exclude: ["**/__tests__/**"],
    });

    expect(result).toEqual([
      pathe.join(rootDir, "src", "index.ts"),
      pathe.join(rootDir, "src", "features", "feature.ts"),
    ]);
  });
});

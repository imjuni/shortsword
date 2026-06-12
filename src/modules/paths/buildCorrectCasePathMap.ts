import os from "node:os";
import chalk from "chalk";
import { replaceSepToPosix } from "my-node-fp";
import pathe from "pathe";
import { TS_EXTENSIONS } from "#modules/paths/TS_EXTENSIONS.js";

export interface ICaseConflict {
  dir: string;
  files: string[];
}

/**
 * Reads every parent directory that appears in inputPaths exactly once, builds a
 * map of original path → correctly-cased filesystem path, and exits the process
 * with an error on case-insensitive platforms (macOS / Windows) when two TypeScript
 * source files in the same directory differ only by letter case (e.g. Aa.ts / aA.ts).
 *
 * @param filePaths - Absolute file paths from the TypeScript compiler (e.g. tsconfig
 *   fileNames or ts-morph SourceFile.getFilePath()). These may carry incorrect casing
 *   on case-insensitive file systems.
 * @returns A Map whose keys are the original input paths and whose values are the
 *   correctly-cased absolute posix paths as reported by the real filesystem.
 */
export async function buildCorrectCasePathMap(
  dirPathMap: Map<string, string[]>,
): Promise<Map<string, string>> {
  // Group input paths by their parent directory so each directory is read only once.

  const platform = os.platform();
  const isCaseInsensitive = platform === "darwin" || platform === "win32";
  const conflicts: ICaseConflict[] = [];
  const resultMap = new Map<string, string>();

  for (const [dir, entries] of dirPathMap.entries()) {
    // dirEntries is built from dirToInputs.keys(), so get() is always defined here
    /* v8 ignore next */
    const pathsInDir = dirPathMap.get(dir) ?? [];

    if (entries.length <= 0) {
      // Directory is not readable; keep the original paths unchanged.
      for (const pathInDir of pathsInDir) {
        resultMap.set(pathInDir, replaceSepToPosix(pathInDir));
      }
      continue;
    }

    // On case-insensitive platforms, detect TypeScript source files whose names
    // are identical when compared case-insensitively.
    if (isCaseInsensitive) {
      const lowerToActual = new Map<string, string[]>();
      for (const entry of entries) {
        if (!TS_EXTENSIONS.has(pathe.extname(entry))) {
          continue;
        }
        const lower = entry.toLowerCase();
        const existing = lowerToActual.get(lower);
        if (existing == null) {
          lowerToActual.set(lower, [entry]);
        } else {
          existing.push(entry);
        }
      }

      for (const conflicting of lowerToActual.values()) {
        if (conflicting.length > 1) {
          conflicts.push({ dir, files: conflicting });
        }
      }
    }

    // Map each input path to its correctly-cased filesystem counterpart.
    for (const inputPath of pathsInDir) {
      const basename = pathe.basename(inputPath);
      const correctEntry = entries.find((entry) => entry.toLowerCase() === basename.toLowerCase());

      const correctedPath = correctEntry != null ? pathe.join(dir, correctEntry) : inputPath;

      resultMap.set(inputPath, replaceSepToPosix(correctedPath));
    }
  }

  if (isCaseInsensitive && conflicts.length > 0) {
    const lines = conflicts.map(
      ({ dir: conflictDir, files }) =>
        `  ${chalk.cyan(conflictDir)}: ${files.map((file) => chalk.yellow(file)).join(", ")}`,
    );

    const platformLabel = platform === "darwin" ? "macOS" : "Windows";
    // eslint-disable-next-line no-console
    console.error(
      [
        chalk.red(
          "ERROR: Case-conflicting TypeScript files detected on a case-insensitive filesystem.",
        ),
        "Files in the same directory differ only by letter case:",
        ...lines,
        `Rename the conflicting files to avoid ambiguity on ${platformLabel}.`,
      ].join("\n"),
    );

    process.exit(1);
  }

  return resultMap;
}

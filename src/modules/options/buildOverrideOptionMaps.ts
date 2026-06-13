import pathe from "pathe";
import type z from "zod";
import { hasDirectoryOverrideOptions } from "#modules/options/hasDirectoryOverrideOptions.js";
import { hasFileOverrideOptions } from "#modules/options/hasFileOverrideOptions.js";
import { resolveOverrideDirectoryPathSet } from "#modules/options/resolveOverrideDirectoryPathSet.js";
import { resolveOverrideFilePathSet } from "#modules/options/resolveOverrideFilePathSet.js";
import type { shortswordArgsZod } from "#schemas/shortswordArgsZod.js";

export async function buildOverrideOptionMaps(params: {
  rootDir: string;
  filePaths: string[];
  dirPaths: string[];
  config: z.infer<typeof shortswordArgsZod>;
}) {
  const baseFileOptions = {
    "max-statements": params.config["max-statements"],
    "use-abs-path": params.config["use-abs-path"],
  };
  const baseDirectoryOptions = { "max-files": params.config["max-files"] };
  const fileOptionMap = new Map<string, typeof baseFileOptions>();
  const directoryOptionMap = new Map<string, typeof baseDirectoryOptions>();

  for (const override of params.config.overrides ?? []) {
    if (hasFileOverrideOptions(override)) {
      const filePathSet = await resolveOverrideFilePathSet({
        rootDir: params.rootDir,
        filePaths: params.filePaths,
        include: override.include,
        exclude: override.exclude,
      });

      for (const filePath of filePathSet) {
        if (!fileOptionMap.has(filePath)) {
          fileOptionMap.set(filePath, {
            "max-statements": override["max-statements"] ?? baseFileOptions["max-statements"],
            "use-abs-path": override["use-abs-path"] ?? baseFileOptions["use-abs-path"],
          });
        }
      }
    }

    if (hasDirectoryOverrideOptions(override)) {
      const directoryPathSet = await resolveOverrideDirectoryPathSet({
        rootDir: params.rootDir,
        dirPaths: params.dirPaths,
        include: override.include,
        exclude: override.exclude,
      });

      for (const dirPath of directoryPathSet) {
        const normalizedDirPath = pathe.normalize(dirPath);
        if (!directoryOptionMap.has(normalizedDirPath)) {
          directoryOptionMap.set(normalizedDirPath, {
            "max-files": override["max-files"] ?? baseDirectoryOptions["max-files"],
          });
        }
      }
    }
  }

  return { baseDirectoryOptions, baseFileOptions, directoryOptionMap, fileOptionMap };
}

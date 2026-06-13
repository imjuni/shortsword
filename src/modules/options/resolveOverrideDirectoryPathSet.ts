import pathe from "pathe";
import { resolveGlobDirectoryPathSet } from "#modules/options/resolveGlobDirectoryPathSet.js";

export async function resolveOverrideDirectoryPathSet(params: {
  rootDir: string;
  dirPaths: string[];
  include: string[];
  exclude?: string[];
}): Promise<Set<string>> {
  const inputPathSet = new Set(params.dirPaths.map((dirPath) => pathe.normalize(dirPath)));
  const includePathSet = await resolveGlobDirectoryPathSet(params.rootDir, params.include);
  let filteredPathSet = new Set(
    Array.from(inputPathSet.values()).filter((dirPath) => includePathSet.has(dirPath)),
  );

  if (params.exclude != null && params.exclude.length > 0) {
    const excludePathSet = await resolveGlobDirectoryPathSet(params.rootDir, params.exclude);
    filteredPathSet = new Set(
      Array.from(filteredPathSet.values()).filter((dirPath) => !excludePathSet.has(dirPath)),
    );
  }

  return filteredPathSet;
}

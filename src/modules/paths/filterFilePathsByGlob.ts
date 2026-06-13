import { glob } from "glob";
import pathe from "pathe";

async function resolveGlobPathSet(rootDir: string, patterns: string[]): Promise<Set<string>> {
  const matchedPaths = await glob(patterns, {
    absolute: true,
    cwd: rootDir,
    dot: true,
    nodir: true,
  });

  return new Set(matchedPaths.map((filePath) => pathe.normalize(filePath)));
}

export async function filterFilePathsByGlob({
  rootDir,
  filePaths,
  include,
  exclude,
}: {
  rootDir: string;
  filePaths: string[];
  include?: string[];
  exclude?: string[];
}): Promise<string[]> {
  if ((include == null || include.length <= 0) && (exclude == null || exclude.length <= 0)) {
    return filePaths;
  }

  // The incoming paths already come from ts-morph after TypeScript applied the
  // tsconfig include/exclude rules. This function only applies Shortsword's
  // extra include/exclude filters when the user explicitly provides them.
  const inputPathSet = new Set(filePaths.map((filePath) => pathe.normalize(filePath)));
  let filteredPathSet = inputPathSet;

  if (include != null && include.length > 0) {
    const includePathSet = await resolveGlobPathSet(rootDir, include);
    filteredPathSet = new Set(
      Array.from(filteredPathSet.values()).filter((filePath) => includePathSet.has(filePath)),
    );
  }

  if (exclude != null && exclude.length > 0) {
    const excludePathSet = await resolveGlobPathSet(rootDir, exclude);
    filteredPathSet = new Set(
      Array.from(filteredPathSet.values()).filter((filePath) => !excludePathSet.has(filePath)),
    );
  }

  return filePaths.filter((filePath) => filteredPathSet.has(pathe.normalize(filePath)));
}

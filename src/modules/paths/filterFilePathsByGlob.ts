import { glob } from "glob";
import { replaceSepToPosix } from "my-node-fp";

interface IFilterFilePathsByGlobParams {
  rootDir: string;
  filePaths: string[];
  include?: string[];
  exclude?: string[];
}

async function resolveGlobPathSet(rootDir: string, patterns: string[]): Promise<Set<string>> {
  const matchedPaths = await glob(patterns, {
    absolute: true,
    cwd: rootDir,
    dot: true,
    nodir: true,
  });

  return new Set(matchedPaths.map((filePath) => replaceSepToPosix(filePath)));
}

export async function filterFilePathsByGlob({
  rootDir,
  filePaths,
  include,
  exclude,
}: IFilterFilePathsByGlobParams): Promise<string[]> {
  if ((include == null || include.length <= 0) && (exclude == null || exclude.length <= 0)) {
    return filePaths;
  }

  const inputPathSet = new Set(filePaths.map((filePath) => replaceSepToPosix(filePath)));
  let filteredPathSet = inputPathSet;

  if (include != null && include.length > 0) {
    const includePathSet = await resolveGlobPathSet(rootDir, include);
    filteredPathSet = new Set(
      filteredPathSet.values().filter((filePath) => includePathSet.has(filePath)),
    );
  }

  if (exclude != null && exclude.length > 0) {
    const excludePathSet = await resolveGlobPathSet(rootDir, exclude);
    filteredPathSet = new Set(
      filteredPathSet.values().filter((filePath) => !excludePathSet.has(filePath)),
    );
  }

  return filePaths.filter((filePath) => filteredPathSet.has(replaceSepToPosix(filePath)));
}

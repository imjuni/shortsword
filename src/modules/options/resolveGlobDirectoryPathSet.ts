import { glob } from "glob";
import pathe from "pathe";

export async function resolveGlobDirectoryPathSet(
  rootDir: string,
  patterns: string[],
): Promise<Set<string>> {
  const matchedPaths = await glob(patterns, {
    cwd: rootDir,
    dot: true,
    withFileTypes: true,
  });

  return new Set(
    matchedPaths
      .filter((filePath) => filePath.isDirectory())
      .map((filePath) => pathe.normalize(filePath.fullpath())),
  );
}

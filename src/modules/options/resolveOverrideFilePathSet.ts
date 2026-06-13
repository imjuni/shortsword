import pathe from "pathe";
import { filterFilePathsByGlob } from "#modules/paths/filterFilePathsByGlob.js";

export async function resolveOverrideFilePathSet(params: {
  rootDir: string;
  filePaths: string[];
  include: string[];
  exclude?: string[];
}): Promise<Set<string>> {
  const filePaths = await filterFilePathsByGlob(params);

  return new Set(filePaths.map((filePath) => pathe.normalize(filePath)));
}

import pathe from "pathe";
import { safeReaddir } from "#modules/paths/safeReaddir.js";
import { TS_EXTENSIONS } from "#modules/paths/TS_EXTENSIONS.js";

export async function getDirPathMap(filePaths: string[]): Promise<Map<string, string[]>> {
  const dirMap = new Map<string, string[]>();
  const dirInFilesMap = new Map<string, string[]>();

  // Group input paths by their parent directory so each directory is read only once.
  for (const filePath of filePaths) {
    const dir = pathe.dirname(filePath);
    const list = dirMap.get(dir);

    if (list == null) {
      dirMap.set(dir, [filePath]);
    } else {
      list.push(filePath);
    }
  }

  // Read all directories in parallel to avoid no-await-in-loop.
  await Promise.all(
    Array.from(dirMap.keys()).map(async (dirPath) => {
      const { dir, entries } = await safeReaddir(dirPath);
      const filteredEntries = entries.filter((entry) => TS_EXTENSIONS.has(pathe.extname(entry)));

      dirInFilesMap.set(dir, filteredEntries);
    }),
  );

  return dirInFilesMap;
}

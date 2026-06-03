import fs from "node:fs";

export async function safeReaddir(
  dir: string,
): Promise<{ dir: string; entries: string[] }> {
  try {
    const entries = await fs.promises.readdir(dir);
    return { dir, entries };
  } catch {
    return { dir, entries: [] };
  }
}

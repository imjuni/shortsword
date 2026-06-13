import type z from "zod";
import type { overrideOptionZod } from "#schemas/overrideOptionZod.js";

export function hasDirectoryOverrideOptions(override: z.infer<typeof overrideOptionZod>): boolean {
  return override["max-files"] != null;
}

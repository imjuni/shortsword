import type z from "zod";
import type { overrideOptionZod } from "#schemas/overrideOptionZod.js";

export function hasFileOverrideOptions(override: z.infer<typeof overrideOptionZod>): boolean {
  return override["max-statements"] != null || override["use-abs-path"] != null;
}

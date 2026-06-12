import pathe from "pathe";
import z from "zod";
import { globPatternsZod } from "#schemas/globPatternsZod.js";
import { overridesZod } from "#schemas/overridesZod.js";

export const shortswordArgsZod = z.object({
  language: z.enum(["ko", "en"]).optional(),
  "max-statements": z.coerce.number().min(1).max(10).default(2),
  "max-files": z.coerce.number().min(1).max(100).default(10),
  include: globPatternsZod,
  exclude: globPatternsZod,
  overrides: overridesZod,
  "use-abs-path": z.boolean().default(false),
  verbose: z.boolean().default(false),
  project: z.string().default(pathe.join(process.cwd(), "tsconfig.json")),
});

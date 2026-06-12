import z from "zod";
import { globPatternsZod } from "#schemas/globPatternsZod.js";
import { requiredGlobPatternsZod } from "#schemas/requiredGlobPatternsZod.js";

export const overrideOptionZod = z.object({
  include: requiredGlobPatternsZod,
  exclude: globPatternsZod,
  "max-statements": z.coerce.number().min(1).max(10).optional(),
  "max-files": z.coerce.number().min(1).max(100).optional(),
  "use-abs-path": z.boolean().optional(),
});

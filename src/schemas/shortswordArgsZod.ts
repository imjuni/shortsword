import pathe from "pathe";
import z from "zod";

export const shortswordArgsZod = z.object({
  language: z.enum(["ko", "en"]).optional(),
  "max-statements": z.coerce.number().min(1).max(10).default(2),
  "max-files": z.coerce.number().min(1).max(100).default(10),
  project: z.string().default(pathe.join(process.cwd(), "tsconfig.json")),
});

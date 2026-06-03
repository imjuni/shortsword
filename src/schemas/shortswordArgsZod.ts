import pathe from "pathe";
import z from "zod";

export const shortswordArgsZod = z.object({
  "file-count": z.coerce.number().min(1).max(10).default(2),
  "dir-count": z.coerce.number().min(1).max(100).default(10),
  project: z.string().default(pathe.join(process.cwd(), "tsconfig.json")),
});

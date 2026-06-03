import pathe from "pathe";
import z from "zod";

const globPatternsZod = z.preprocess((value) => {
  if (value == null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) =>
      typeof entry === "string"
        ? entry
            .split(",")
            .map((pattern) => pattern.trim())
            .filter((pattern) => pattern.length > 0)
        : entry,
    );
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((pattern) => pattern.trim())
      .filter((pattern) => pattern.length > 0);
  }

  return value;
}, z.array(z.string().min(1)).optional());

export const shortswordArgsZod = z.object({
  language: z.enum(["ko", "en"]).optional(),
  "max-statements": z.coerce.number().min(1).max(10).default(2),
  "max-files": z.coerce.number().min(1).max(100).default(10),
  include: globPatternsZod,
  exclude: globPatternsZod,
  project: z.string().default(pathe.join(process.cwd(), "tsconfig.json")),
});

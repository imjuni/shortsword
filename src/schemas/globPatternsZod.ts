import z from "zod";
import { normalizeGlobPatterns } from "#schemas/normalizeGlobPatterns.js";

export const globPatternsZod = z.preprocess(
  normalizeGlobPatterns,
  z.array(z.string().min(1)).optional(),
);

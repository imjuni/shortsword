import z from "zod";
import { overrideOptionZod } from "#schemas/overrideOptionZod.js";

export const overridesZod = z.preprocess((value) => {
  if (value == null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}, z.array(overrideOptionZod).optional());

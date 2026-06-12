import { splitGlobPatterns } from "#schemas/splitGlobPatterns.js";

export function normalizeGlobPatterns(value: unknown): unknown {
  if (value == null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => (typeof entry === "string" ? splitGlobPatterns(entry) : entry));
  }

  if (typeof value === "string") {
    return splitGlobPatterns(value);
  }

  return value;
}

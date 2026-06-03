import { describe, expect, it, vi } from "vitest";
import { getLocale } from "#i18n/getLocale.js";

describe("getLocale", () => {
  it("should return system locale when any other mocking", () => {
    const locale = getLocale();
    expect(locale).toEqual("en");
  });
});

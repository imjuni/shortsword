import { describe, expect, it } from "vitest";
import { isDescendant } from "#modules/paths/isDescendant.js";

describe("isDescendant", () => {
  const root = "/project/src";

  it("should return true when pass file in child directory", () => {
    const result = isDescendant(root, "/project/src/components/Button.ts"); // true
    expect(result).toBeTruthy();
  });

  it("should return true when pass child directory ", () => {
    const result = isDescendant(root, "/project/src/components"); // true
    expect(result).toBeTruthy();
  });

  it("", () => {
    const result = isDescendant(root, "/project/src"); // false (자기 자신은 하위가 아님)
    expect(result).toBeFalsy();
  });

  it("", () => {
    const result = isDescendant(root, "/project/src-backup/index.ts"); // false (문자열 매칭 버그 방지)
    expect(result).toBeFalsy();
  });

  it("", () => {
    const result = isDescendant(root, "/project/assets/logo.png"); // false (상위 또는 다른 트리)
    expect(result).toBeFalsy();
  });
});

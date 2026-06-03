import { randomUUID } from "node:crypto";
import pathe from "pathe";
import type * as tsm from "ts-morph";
import { beforeAll, describe, expect, it } from "vitest";
import { getTypeScriptProject } from "#modules/compilers/getTypeScriptProject.js";
import { hasExactlyNDeclarations } from "#modules/compilers/hasExactlyNDeclarations.js";

describe("hasExactlyNDeclarations", () => {
  let project: tsm.Project;

  beforeAll(() => {
    project = getTypeScriptProject({
      tsConfigFilePath: pathe.join(process.cwd(), "tsconfig.json"),
    });
  });

  it("should return true when source file has only 2 statement, type alias and function", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

type Name = string;

export function hello(): Name {
  console.log('hello');

  return 'hello';
}
    `;
    const sourceFile = project.createSourceFile(
      `/hello/${filename}.ts`,
      sourceFileText.trim(),
    );

    const result = hasExactlyNDeclarations(sourceFile, 2);
    expect(result).toBeTruthy();
  });

  it("should return true when source file has only 2 statement, interface and function", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

interface Person {
  name: string
}

export function hello(): Person {
  console.log('hello');

  return { name: 'hello' };
}
    `;
    const sourceFile = project.createSourceFile(
      `/hello/${filename}.ts`,
      sourceFileText.trim(),
    );

    const result = hasExactlyNDeclarations(sourceFile, 2);
    expect(result).toBeTruthy();
  });

  it("should return true when source file has only 2 statement, variable and function", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

const name = 'hello';

export function hello(): Person {
  console.log('hello');

  return { name };
}
    `;
    const sourceFile = project.createSourceFile(
      `/hello/${filename}.ts`,
      sourceFileText.trim(),
    );

    const result = hasExactlyNDeclarations(sourceFile, 2);
    expect(result).toBeTruthy();
  });

  it("should return true when source file has only 2 statement, variable and function", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

const name = 'hello';

const age = 22;

export function hello(): Person {
  console.log('hello');

  return { name, age };
}
    `;
    const sourceFile = project.createSourceFile(
      `/hello/${filename}.ts`,
      sourceFileText.trim(),
    );

    const result = hasExactlyNDeclarations(sourceFile, 2);
    expect(result).toBeFalsy();
  });
});

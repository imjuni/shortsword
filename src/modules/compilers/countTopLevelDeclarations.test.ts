import { randomUUID } from "node:crypto";
import pathe from "pathe";
import type * as tsm from "ts-morph";
import { beforeAll, describe, expect, it } from "vitest";
import { countTopLevelDeclarations } from "#modules/compilers/countTopLevelDeclarations.js";
import { getTypeScriptProject } from "#modules/compilers/getTypeScriptProject.js";

describe("countTopLevelDeclarations", () => {
  let project: tsm.Project;

  beforeAll(() => {
    project = getTypeScriptProject({
      tsConfigFilePath: pathe.join(process.cwd(), "tsconfig.json"),
    });
  });

  it("should return 2 when source file has type alias and function declarations", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

type Name = string;

export function hello(): Name {
  console.log('hello');

  return 'hello';
}
    `;
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = countTopLevelDeclarations(sourceFile);
    expect(result).toBe(2);
  });

  it("should return 2 when source file has interface and function declarations", () => {
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
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = countTopLevelDeclarations(sourceFile);
    expect(result).toBe(2);
  });

  it("should return 4 when source file has interface and function declarations", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

interface Person {
  name: string
}

export interface Job {
  name: string
}

export interface Major {
  name: string
}

export function hello(): Person {
  console.log('hello');

  return { name: 'hello' };
}
    `;
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = countTopLevelDeclarations(sourceFile);
    expect(result).toBe(4);
  });

  it("should return 2 when source file has variable and function declarations", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';

const name = 'hello';

export function hello(): Person {
  console.log('hello');

  return { name };
}
    `;
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = countTopLevelDeclarations(sourceFile);
    expect(result).toBe(2);
  });

  it("should return 3 when source file has two variables and function declarations", () => {
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
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = countTopLevelDeclarations(sourceFile);
    expect(result).toBe(3);
  });
});

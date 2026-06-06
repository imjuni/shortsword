import { randomUUID } from "node:crypto";
import pathe from "pathe";
import type * as tsm from "ts-morph";
import { beforeAll, describe, expect, it } from "vitest";
import { findRelativeImports } from "#modules/compilers/findRelativeImports.js";
import { getTypeScriptProject } from "#modules/compilers/getTypeScriptProject.js";

describe("findRelativeImports", () => {
  let project: tsm.Project;

  beforeAll(() => {
    project = getTypeScriptProject({
      tsConfigFilePath: pathe.join(process.cwd(), "tsconfig.json"),
    });
  });

  it("should return relative import specifiers", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';
import { helper } from './helper.js';
import { model } from '../models/model.js';
import { loadArgs } from '#modules/args/loadArgs.js';
import { createApp } from '@app/createApp.js';

export function hello(): void {
  console.log(pathe, helper, model, loadArgs, createApp);
}
    `;
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = findRelativeImports(sourceFile);

    expect(result).toEqual([
      { line: 2, specifier: "./helper.js" },
      { line: 3, specifier: "../models/model.js" },
    ]);
  });

  it("should return empty array when imports are package, path alias, or subpath imports", () => {
    const filename = randomUUID().replaceAll("-", "");
    const sourceFileText = `
import pathe from 'pathe';
import { loadArgs } from '#modules/args/loadArgs.js';
import { createApp } from '@app/createApp.js';
import { renderToString } from 'react-dom/server';

export function hello(): void {
  console.log(pathe, loadArgs, createApp, renderToString);
}
    `;
    const sourceFile = project.createSourceFile(`/hello/${filename}.ts`, sourceFileText.trim());

    const result = findRelativeImports(sourceFile);

    expect(result).toEqual([]);
  });
});

import type { CommandContext } from "citty";
import consola from "consola";
import pathe from "pathe";
import type * as tsm from "ts-morph";
import type { shortswordArgs } from "#commands/shortswordArgs.js";
import { getLocale } from "#i18n/getLocale.js";
import { i18n } from "#i18n/i18n.js";
import { loadArgs } from "#modules/args/loadArgs.js";
import { getTypeScriptConfig } from "#modules/compilers/getTypeScriptConfig.js";
import { getTypeScriptProject } from "#modules/compilers/getTypeScriptProject.js";
import { hasExactlyNDeclarations } from "#modules/compilers/hasExactlyNDeclarations.js";
import { buildCorrectCasePathMap } from "#modules/paths/buildCorrectCasePathMap.js";
import { isDescendant } from "#modules/paths/isDescendant.js";

export const shortswordRun = async ({
  args,
  cmd,
}: CommandContext<typeof shortswordArgs>) => {
  const locale = args.language ?? getLocale();
  i18n.locale(locale);

  consola.debug("Shortsword locale: ", locale);

  // Validation configuration after loading configuration and args
  const config = await loadArgs(args, cmd);

  // read tsconfig.json
  const tsconfigDir = pathe.dirname(config.data.project);
  const tsconfig = getTypeScriptConfig(config.data.project);
  consola.debug("TypeScript tsconfig.json path: ", locale);

  // read TypeScript project
  const tsProject = getTypeScriptProject({
    tsConfigFilePath: config.data.project,
  });

  // Get valid filePaths
  const rawFilePaths = tsProject
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());
  const caseMap = await buildCorrectCasePathMap(rawFilePaths);
  const filePaths = rawFilePaths
    .map((rawFilePath) => caseMap.get(rawFilePath) ?? rawFilePath)
    .filter((filePath) => isDescendant(tsconfigDir, filePath));

  // Build correctedPath → SourceFile map so lookups remain correct after case
  // correction. ts-morph registers files by their original (possibly wrong-cased)
  // path, so project.getSourceFile(correctedPath) can return null on
  // case-sensitive systems or strict ts-morph builds.
  const sourceFileMap = new Map<string, tsm.SourceFile>(
    tsProject.getSourceFiles().map((sourceFile) => {
      const original = sourceFile.getFilePath().toString();
      return [caseMap.get(original) ?? original, sourceFile];
    }),
  );

  const detected = sourceFileMap
    .values()
    .filter((sourceFile) =>
      hasExactlyNDeclarations(sourceFile, config.data["file-count"]),
    );
};

import chalk from "chalk";
import type { CommandContext } from "citty";
import consola from "consola";
import { isDescendant } from "my-node-fp";
import pathe from "pathe";
import type * as tsm from "ts-morph";
import type { shortswordArgs } from "#commands/shortswordArgs.js";
import { getLocale } from "#i18n/getLocale.js";
import { i18n } from "#i18n/i18n.js";
import { loadArgs } from "#modules/args/loadArgs.js";
import { countTopLevelDeclarations } from "#modules/compilers/countTopLevelDeclarations.js";
import { getTypeScriptProject } from "#modules/compilers/getTypeScriptProject.js";
import { buildCorrectCasePathMap } from "#modules/paths/buildCorrectCasePathMap.js";
import { filterFilePathsByGlob } from "#modules/paths/filterFilePathsByGlob.js";
import { getDirPathMap } from "#modules/paths/getDirPathMap.js";

export const shortswordRun = async ({ args, cmd }: CommandContext<typeof shortswordArgs>) => {
  const locale = args.language ?? getLocale();
  i18n.locale(locale);

  consola.debug("Use locale: ", locale);

  // Validation configuration after loading configuration and args
  const config = await loadArgs(args, cmd);

  // read tsconfig.json
  const tsconfigDir = pathe.dirname(config.data.project);

  consola.debug("tsconfig: ", tsconfigDir, config.data.project);

  // read TypeScript project
  const tsProject = getTypeScriptProject({
    tsConfigFilePath: config.data.project,
  });

  // Get valid filePaths
  const rawFilePaths = tsProject
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());
  const descendantFilePaths = rawFilePaths.filter((filePath) =>
    isDescendant(tsconfigDir, filePath),
  );
  // TypeScript already resolves tsconfig include/exclude when ts-morph builds
  // the project. Shortsword's include/exclude options are intentionally applied
  // after that step as an additional override for project-specific cases, such
  // as legacy repositories that keep test files under __tests__ or __test__.
  const filteredRawFilePaths = await filterFilePathsByGlob({
    rootDir: tsconfigDir,
    filePaths: descendantFilePaths,
    include: config.data.include,
    exclude: config.data.exclude,
  });
  const filteredRawFilePathSet = new Set(filteredRawFilePaths);
  const dirPathMap = await getDirPathMap(filteredRawFilePaths);
  const caseMap = await buildCorrectCasePathMap(dirPathMap);

  // Build correctedPath → SourceFile map so lookups remain correct after case
  // correction. ts-morph registers files by their original (possibly wrong-cased)
  // path, so project.getSourceFile(correctedPath) can return null on
  // case-sensitive systems or strict ts-morph builds.
  const sourceFileMap = new Map<string, tsm.SourceFile>(
    tsProject
      .getSourceFiles()
      .filter((sourceFile) => filteredRawFilePathSet.has(sourceFile.getFilePath().toString()))
      .map((sourceFile) => {
        const original = sourceFile.getFilePath().toString();
        return [caseMap.get(original) ?? original, sourceFile];
      }),
  );

  const maxStatements = config.data["max-statements"];
  const maxFiles = config.data["max-files"];

  const fileCountViolations = Array.from(dirPathMap.entries())
    .map(([dirPath, filePaths]) => ({ dirPath, filePaths }))
    .filter((entry) => entry.filePaths.length > maxFiles);

  const statementCountViolations = Array.from(sourceFileMap.values())
    .map((sourceFile) => ({
      sourceFile,
      statementCount: countTopLevelDeclarations(sourceFile),
    }))
    .filter((entry) => entry.statementCount > maxStatements);

  if (fileCountViolations.length > 0) {
    consola.error("오류: ");
    console.log(
      fileCountViolations
        .map((fileCount) => {
          return `  ${chalk.red("✖")} "${fileCount.dirPath}" > ${fileCount.filePaths.length} files`;
        })
        .join("\n"),
      "\n",
    );
  }

  if (statementCountViolations.length > 0) {
    consola.error("오류: ");

    console.error(
      statementCountViolations
        .map((statement) => {
          return `  ${chalk.red("✖")} ${statement.sourceFile.getFilePath().toString()} > ${statement.statementCount} statements`;
        })
        .join("\n"),
      "\n",
    );
  }

  if (fileCountViolations.length + statementCountViolations.length > 0) {
    process.exit(1);
  } else {
    consola.success("오류 없음");
  }
};

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
  consola.level = config.data.verbose ? 4 : consola.level;

  // Use an absolute tsconfig path because ts-morph returns absolute source file
  // paths. Keeping both sides absolute avoids descendant checks drifting when
  // the project option is passed as a relative path.
  const tsconfigPath = pathe.resolve(config.data.project);
  const tsconfigDir = pathe.dirname(tsconfigPath);

  consola.debug("Resolved config", {
    exclude: config.data.exclude,
    include: config.data.include,
    maxFiles: config.data["max-files"],
    maxStatements: config.data["max-statements"],
    project: tsconfigPath,
    tsconfigDir,
  });

  // read TypeScript project
  consola.debug("Loading TypeScript project", { tsconfigPath });
  const tsProject = getTypeScriptProject({
    tsConfigFilePath: tsconfigPath,
  });

  // Get valid filePaths
  const rawFilePaths = tsProject
    .getSourceFiles()
    .map((sourceFile) => sourceFile.getFilePath().toString());
  consola.debug("Loaded source files", { count: rawFilePaths.length });

  const descendantFilePaths = rawFilePaths.filter((filePath) =>
    isDescendant(tsconfigDir, filePath),
  );
  consola.debug("Filtered source files by tsconfig directory", {
    count: descendantFilePaths.length,
    excluded: rawFilePaths.length - descendantFilePaths.length,
  });

  // TypeScript already resolves tsconfig include/exclude when ts-morph builds
  // the project. Shortsword's include/exclude options are intentionally applied
  // after that step as an additional override for project-specific cases, such
  // as legacy repositories that keep test files under __tests__ or __test__.
  consola.debug("Applying Shortsword include/exclude filters", {
    exclude: config.data.exclude,
    include: config.data.include,
  });
  const filteredRawFilePaths = await filterFilePathsByGlob({
    rootDir: tsconfigDir,
    filePaths: descendantFilePaths,
    include: config.data.include,
    exclude: config.data.exclude,
  });
  consola.debug("Filtered source files by Shortsword options", {
    count: filteredRawFilePaths.length,
    excluded: descendantFilePaths.length - filteredRawFilePaths.length,
  });

  const filteredRawFilePathSet = new Set(
    filteredRawFilePaths.map((filePath) => pathe.normalize(filePath)),
  );
  const isIncludedFilePath = (filePath: string) =>
    filteredRawFilePathSet.has(pathe.normalize(filePath));
  const dirPathMap = await getDirPathMap(filteredRawFilePaths);
  consola.debug("Built directory path map", { count: dirPathMap.size });

  const caseMap = await buildCorrectCasePathMap(dirPathMap);
  consola.debug("Built correct-case path map", { count: caseMap.size });

  // Build correctedPath → SourceFile map so lookups remain correct after case
  // correction. ts-morph registers files by their original (possibly wrong-cased)
  // path, so project.getSourceFile(correctedPath) can return null on
  // case-sensitive systems or strict ts-morph builds.
  const sourceFileMap = new Map<string, tsm.SourceFile>(
    tsProject
      .getSourceFiles()
      .filter((sourceFile) => isIncludedFilePath(sourceFile.getFilePath().toString()))
      .map((sourceFile) => {
        const original = sourceFile.getFilePath().toString();
        return [caseMap.get(original) ?? original, sourceFile];
      }),
  );
  consola.debug("Built source file map", { count: sourceFileMap.size });

  const maxStatements = config.data["max-statements"];
  const maxFiles = config.data["max-files"];

  const fileCountViolations = Array.from(dirPathMap.entries())
    .map(([dirPath, filePaths]) => ({
      dirPath,
      // getDirPathMap reads the real directory entries for case checking and
      // max-files detection. Apply the Shortsword include/exclude result here
      // so excluded files, such as *.test.ts, do not count toward max-files.
      filePaths: filePaths.filter((filePath) =>
        isIncludedFilePath(pathe.resolve(dirPath, filePath)),
      ),
    }))
    .filter((entry) => entry.filePaths.length > maxFiles);
  consola.debug("Detected file count violations", {
    count: fileCountViolations.length,
  });

  const statementCountViolations = Array.from(sourceFileMap.values())
    // Keep the statement check on the same include/exclude-filtered file set as
    // max-files. This is intentionally repeated at the violation stage so
    // future changes to sourceFileMap construction cannot reintroduce excluded
    // files into statement counting.
    .filter((sourceFile) => isIncludedFilePath(sourceFile.getFilePath().toString()))
    .map((sourceFile) => ({
      sourceFile,
      statementCount: countTopLevelDeclarations(sourceFile),
    }))
    .filter((entry) => entry.statementCount > maxStatements);
  consola.debug("Detected statement count violations", {
    count: statementCountViolations.length,
  });

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

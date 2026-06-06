import consola from "consola";
import type { SourceFile } from "ts-morph";

export interface IRelativeImport {
  line: number;
  specifier: string;
}

export function findRelativeImports(sourceFile: SourceFile): IRelativeImport[] {
  const relativeImports = sourceFile
    .getImportDeclarations()
    .map((importDeclaration) => ({
      line: importDeclaration.getStartLineNumber(),
      specifier: importDeclaration.getModuleSpecifierValue(),
    }))
    .filter((importDeclaration) => importDeclaration.specifier.startsWith("."));

  consola.debug(
    `[${sourceFile.getFilePath().toString()}] relative import count: ${relativeImports.length}`,
  );

  return relativeImports;
}

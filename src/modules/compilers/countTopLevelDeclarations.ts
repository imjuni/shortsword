import consola from "consola";
import { Node, type SourceFile } from "ts-morph";

export function countTopLevelDeclarations(sourceFile: SourceFile): number {
  // Read every top-level statement in the source file.
  const statements = sourceFile.getStatements();

  const declarationCount = statements.filter((statement) => {
    if (Node.isImportDeclaration(statement)) return false;
    if (Node.isExpressionStatement(statement)) return false;

    return true;
  }).length;

  consola.debug(
    `[${sourceFile.getFilePath().toString()}] declaration count: ${declarationCount}`,
  );

  return declarationCount;
}

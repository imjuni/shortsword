import consola from "consola";
import { Node, type SourceFile } from "ts-morph";

export function hasExactlyNDeclarations(
  sourceFile: SourceFile,
  n: number,
): boolean {
  // 최상위 구문(Statements)을 다 가져옵니다.
  const statements = sourceFile.getStatements();

  const declarationCount = statements.filter((statement) => {
    // 1. 단순 import 구문은 '선언' 카운트에서 제외하고 싶다면 제거 (원하시면 살려도 됩니다)
    if (Node.isImportDeclaration(statement)) return false;

    // 2. 주석이나 공백은 getStatements()에 안 잡히므로 안심하셔도 됩니다.
    // 3. 표현식(예: console.log(1);) 같은 단순 실행문도 제외하고 싶다면 아래 주석 해제
    if (Node.isExpressionStatement(statement)) return false;

    // 그 외 class, function, interface, type-alias, namespace, enum,
    // 심지어 export문까지 "코드 상에 선언된 한 덩어리"로 전부 인정합니다.
    return true;
  }).length;

  consola.debug(
    `[${sourceFile.getFilePath().toString()}] 총 선언 개수: ${declarationCount}개 (목표: ${n}개)`,
  );

  return declarationCount === n;
}

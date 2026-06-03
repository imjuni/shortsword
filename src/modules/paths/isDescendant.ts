import { relative, resolve } from "pathe";

/**
 * parent 경로 하위에 child 경로가 포함되어 있는지 여부를 반환합니다.
 */
export function isDescendant(parent: string, child: string): boolean {
  const rel = relative(resolve(parent), resolve(child));

  // 하위 디렉터리라면 relative 결과가 '..'으로 시작하지 않고, 자기 자신(빈 문자열)도 아니어야 합니다.
  return !!rel && !rel.startsWith("..") && !rel.startsWith("/");
}

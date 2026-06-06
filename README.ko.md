# Shortsword

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/shortsword.svg)](https://npmcharts.com/compare/shortsword?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/shortsword.svg?style=popout)](https://github.com/imjuni/shortsword)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/shortsword.svg)](https://github.com/imjuni/shortsword/issues)
[![NPM version](https://img.shields.io/npm/v/shortsword.svg)](https://www.npmjs.com/package/shortsword)
[![License](https://img.shields.io/npm/l/shortsword.svg)](https://github.com/imjuni/shortsword/blob/master/LICENSE)
[![ci](https://github.com/imjuni/shortsword/actions/workflows/ci.yml/badge.svg)](https://github.com/imjuni/shortsword/actions/workflows/ci.yml)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa.svg?style=flat-square)](https://biomejs.dev)

Shortsword는 ESLint, Biome과 같이 사용하는 간단한 도구입니다. 한 파일에 많은 코드를 추가하거나 수십 개의 선언을 추가하는 경우 이를 탐지할 수 있는 방법이 있으면 좋을 것 같아서 만들게 되었습니다. 특히 AI를 사용하여 코딩할 때 한 파일에 수십 개의 타입, 함수 등을 추가하는 경우를 보고 규칙을 작성했지만 컨텍스트 이슈로 인해서 이 규칙을 종종 무시하는 경우를 보고 harness로 동작할 수 있는 간단한 도구가 필요하겠다고 생각해서 작성하게 되었습니다.

`--max-statements` 옵션을 사용하여 한 파일에 선언 가능한 최대 statement 개수를 설정할 수 있고, `--max-files`를 사용하여 한 디렉터리에 최대 몇 개까지 파일을 추가할 수 있는지 설정할 수 있습니다.

Before:

```text
src/user.ts > 12 statements
src/features > 24 files
```

After:

```text
src/user/createUser.ts > 2 statements
src/user/updateUser.ts > 2 statements
src/user/deleteUser.ts > 2 statements
src/features/user > 8 files
src/features/auth > 6 files
src/features/billing > 5 files
```

자, 이제 shortsword를 사용하여 안전하고 즐거운 코딩하세요!

## Usage

```bash
npx swd
```

```bash
npx swd -s 2 -f 10 -x "**/*.test.ts,**/__tests__/**" -p ./tsconfig.json
```

## Options

| Option | Alias | Default | Description |
| --- | --- | ---: | --- |
| `--max-statements` | `-s` | `2` | 한 파일에 허용할 최대 top-level statement 개수 |
| `--max-files` | `-f` | `10` | 한 디렉터리에 허용할 최대 TypeScript 파일 개수 |
| `--include` | `-i` | - | 추가로 포함할 glob 패턴 |
| `--exclude` | `-x` | - | 추가로 제외할 glob 패턴 |
| `--project` | `-p` | `./tsconfig.json` | `tsconfig.json` 경로. 검사 대상 파일을 tsconfig.json 기준으로 자동 적용 |
| `--language` | `-l` | 자동 감지 | 메시지 언어 |
| `--verbose` | `-v` | `false` | 디버그 로그 출력 |

## Installation

```bash
pnpm add -D shortsword typescript
```

```bash
npm install -D shortsword typescript
```

## Requirements

- Node.js >= 22
- TypeScript >= 6

### Configuration

CLI 옵션 대신 설정 파일을 사용할 수 있습니다. Shortsword는 `shortsword.config.ts`, `shortsword.config.js`, `.shortswordrc` 등 설정 파일을 읽습니다.

```ts
export default {
  "max-statements": 2,
  "max-files": 10,
  exclude: ["**/*.test.ts", "**/__tests__/**", "**/__test__/**"],
  project: "./tsconfig.json",
};
```

CLI 옵션과 설정 파일을 함께 사용하면 CLI 옵션이 우선합니다.

## License

MIT

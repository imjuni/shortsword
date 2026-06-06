# Shortsword

![ts](https://flat.badgen.net/badge/Built%20With/TypeScript/blue)
[![Download Status](https://img.shields.io/npm/dw/shortsword.svg)](https://npmcharts.com/compare/shortsword?minimal=true)
[![Github Star](https://img.shields.io/github/stars/imjuni/shortsword.svg?style=popout)](https://github.com/imjuni/shortsword)
[![Github Issues](https://img.shields.io/github/issues-raw/imjuni/shortsword.svg)](https://github.com/imjuni/shortsword/issues)
[![NPM version](https://img.shields.io/npm/v/shortsword.svg)](https://www.npmjs.com/package/shortsword)
[![License](https://img.shields.io/npm/l/shortsword.svg)](https://github.com/imjuni/shortsword/blob/master/LICENSE)
[![ci](https://github.com/imjuni/shortsword/actions/workflows/ci.yml/badge.svg)](https://github.com/imjuni/shortsword/actions/workflows/ci.yml)
[![code style: biome](https://img.shields.io/badge/code_style-biome-60a5fa.svg?style=flat-square)](https://biomejs.dev)

Shortsword is a small tool designed to work alongside ESLint and Biome. It helps detect files with too much code or too many declarations, especially when AI-assisted coding adds many types, functions, or other declarations to a single file. It was built as a lightweight harness for SFSR-style constraints.

Use `--max-statements` to set the maximum number of statements allowed in a file, and `--max-files` to set the maximum number of files allowed in a directory.

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

Now use Shortsword and enjoy safer, happier coding.

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
| `--max-statements` | `-s` | `2` | Maximum top-level statements allowed per file |
| `--max-files` | `-f` | `10` | Maximum TypeScript files allowed per directory |
| `--include` | `-i` | - | Additional include glob patterns |
| `--exclude` | `-x` | - | Additional exclude glob patterns |
| `--project` | `-p` | `./tsconfig.json` | Path to the `tsconfig.json` used to resolve target files |
| `--language` | `-l` | auto-detected | Message language |
| `--verbose` | `-v` | `false` | Show debug logs |

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

You can use a configuration file instead of CLI options. Shortsword reads configuration files such as `shortsword.config.ts`, `shortsword.config.js`, and `.shortswordrc`.

```ts
export default {
  "max-statements": 2,
  "max-files": 10,
  exclude: ["**/*.test.ts", "**/__tests__/**", "**/__test__/**"],
  project: "./tsconfig.json",
};
```

CLI options take precedence when both CLI options and a configuration file are used.

## License

MIT

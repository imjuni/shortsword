import rosetta from "rosetta";

export const i18n = rosetta({
  en: {
    args: {
      description: {
        language: "choose your language",
        maxStatements: "Maximum statements allowed per file",
        maxFiles: "Maximum files allowed per directory",
        include: "Additional include glob patterns",
        exclude: "Additional exclude glob patterns",
        verbose: "Show debug logs",
        project: "tsconfig.json 파일 경로",
      },
      error: {
        language: {
          invalid: "Language must be one of: ko, en",
        },
        maxStatements: {
          min: "Maximum statements must be 1 or greater",
          max: "Maximum statements cannot exceed 10",
          invalid: "Maximum statements must be a valid number",
        },
        maxFiles: {
          min: "Maximum files must be 1 or greater",
          max: "Maximum files cannot exceed 100",
          invalid: "Maximum files must be a valid number",
        },
        include: {
          invalid: "Include must be a glob pattern or glob pattern list",
        },
        exclude: {
          invalid: "Exclude must be a glob pattern or glob pattern list",
        },
      },
    },
  },
  ko: {
    args: {
      description: {
        language: "언어를 선택하세요",
        maxStatements: "한 파일에 허용할 최대 statement 수",
        maxFiles: "한 디렉터리에 허용할 최대 파일 수",
        include: "추가로 포함할 glob 패턴",
        exclude: "추가로 제외할 glob 패턴",
        verbose: "디버그 로그 출력",
      },
      error: {
        language: {
          invalid: "언어는 ko 또는 en 중 하나여야 합니다",
        },
        maxStatements: {
          min: "최대 statement 수는 1개 이상이어야 합니다",
          max: "최대 statement 수는 10개를 초과할 수 없습니다",
          invalid: "최대 statement 수는 올바른 숫자 형식이어야 합니다",
        },
        maxFiles: {
          min: "최대 파일 수는 1개 이상이어야 합니다",
          max: "최대 파일 수는 100개를 초과할 수 없습니다",
          invalid: "최대 파일 수는 올바른 숫자 형식이어야 합니다",
        },
        include: {
          invalid: "include는 glob 패턴 또는 glob 패턴 목록이어야 합니다",
        },
        exclude: {
          invalid: "exclude는 glob 패턴 또는 glob 패턴 목록이어야 합니다",
        },
      },
    },
  },
});

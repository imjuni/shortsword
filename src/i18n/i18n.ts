import rosetta from "rosetta";

export const i18n = rosetta({
  en: {
    args: {
      description: {
        language: "choose your language",
        maxStatements: "Maximum statements allowed per file",
        maxFiles: "Maximum files allowed per directory",
        project: "tsconfig.json 파일 경로",
      },
      error: {
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
      },
    },
  },
  ko: {
    args: {
      description: {
        language: "언어를 선택하세요",
        maxStatements: "한 파일에 허용할 최대 statement 수",
        maxFiles: "한 디렉터리에 허용할 최대 파일 수",
      },
      error: {
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
      },
    },
  },
});

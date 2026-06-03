import rosetta from "rosetta";

export const i18n = rosetta({
  en: {
    args: {
      description: {
        language: "choose your language",
        fileCount: "한 파일에서 export 한 syntax 외 허용 할 최대 syntax 수",
        dirCount: "한 디렉토리에 허용할 최대 파일 수",
        project: "tsconfig.json 파일 경로",
      },
      error: {
        fileCount: {
          min: "File count must be 0 or greater",
          max: "File count cannot exceed 10",
          invalid: "File count must be a valid number",
        },
        dirCount: {
          min: "Directory count must be 2 or greater",
          max: "Directory count cannot exceed 100",
          invalid: "Directory count must be a valid number",
        },
      },
    },
  },
  ko: {
    args: {
      description: {
        language: "언어를 선택하세요",
        fileCount: "한 파일에서 export 한 syntax 외 허용 할 최대 syntax 수",
        dirCount: "한 디렉토리에 허용할 최대 파일 수",
      },
      error: {
        fileCount: {
          min: "파일 개수는 0개 이상이어야 합니다",
          max: "파일 개수는 최대 10개를 초과할 수 없습니다",
          invalid: "파일 개수는 올바른 숫자 형식이어야 합니다",
        },
        dirCount: {
          min: "디렉터리 개수는 최소 2개 이상이어야 합니다",
          max: "디렉터리 개수는 최대 100개를 초과할 수 없습니다",
          invalid: "디렉터리 개수는 올바른 숫자 형식이어야 합니다",
        },
      },
    },
  },
});

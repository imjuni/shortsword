import type { ArgsDef } from "citty";
import { i18n } from "#i18n/i18n.js";

export const shortswordArgs = {
  language: {
    type: "enum",
    alias: "l",
    options: ["ko", "en"],
    get description() {
      return i18n.t("args.description.language");
    },
  },
  "file-count": {
    type: "string",
    alias: "f",
    get description() {
      return i18n.t("args.description.fileCount");
    },
  },
  "dir-count": {
    type: "string",
    alias: "d",
    get description() {
      return i18n.t("args.description.dirCount");
    },
  },
  project: {
    type: "string",
    alias: "p",
    get description() {
      return i18n.t("args.description.project");
    },
  },
} as const satisfies ArgsDef;

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
  "max-statements": {
    type: "string",
    alias: "s",
    get description() {
      return i18n.t("args.description.maxStatements");
    },
  },
  "max-files": {
    type: "string",
    alias: "f",
    get description() {
      return i18n.t("args.description.maxFiles");
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

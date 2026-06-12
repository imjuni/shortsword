import type { ArgsDef } from "citty";
import { i18n } from "#i18n/i18n.js";

export const shortswordArgs = {
  language: {
    type: "string",
    alias: "l",
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
  include: {
    type: "string",
    alias: "i",
    get description() {
      return i18n.t("args.description.include");
    },
  },
  exclude: {
    type: "string",
    alias: "x",
    get description() {
      return i18n.t("args.description.exclude");
    },
  },
  overrides: {
    type: "string",
    get description() {
      return i18n.t("args.description.overrides");
    },
  },
  "use-abs-path": {
    type: "boolean",
    get description() {
      return i18n.t("args.description.useAbsPath");
    },
  },
  verbose: {
    type: "boolean",
    alias: "v",
    get description() {
      return i18n.t("args.description.verbose");
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

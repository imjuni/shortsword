import type { IErrorMappingTable } from "#i18n/IErrorMappingTable.js";

export function getShortswordZodErrorMap(): IErrorMappingTable {
  return {
    "language.invalid_value": "args.error.language.invalid",

    "max-statements.too_small": "args.error.maxStatements.min",
    "max-statements.too_big": "args.error.maxStatements.max",
    "max-statements.invalid_type": "args.error.maxStatements.invalid",

    "max-files.too_small": "args.error.maxFiles.min",
    "max-files.too_big": "args.error.maxFiles.max",
    "max-files.invalid_type": "args.error.maxFiles.invalid",
  };
}

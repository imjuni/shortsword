import type { IErrorMappingTable } from "#i18n/IErrorMappingTable.js";

export function getShortswordZodErrorMap(): IErrorMappingTable {
  return {
    "file-count.too_small": "args.error.fileCount.min",
    "file-count.too_big": "args.error.fileCount.max",
    "file-count.invalid_type": "args.error.fileCount.invalid",

    "dir-count.too_small": "args.error.dirCount.min",
    "dir-count.too_big": "args.error.dirCount.max",
    "dir-count.invalid_type": "args.error.dirCount.invalid",
  };
}

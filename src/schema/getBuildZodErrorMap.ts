import type { IErrorMappingTable } from "#i18n/IErrorMappingTable.js";

export function getBuildZodErrorMap(): IErrorMappingTable {
	return {
		"out.invalid_type": "build.error.out.required",
		"out.too_small": "build.error.out.min",
	};
}

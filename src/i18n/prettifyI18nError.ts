import chalk from "chalk";
import type { z } from "zod";
import type { IErrorMappingTable } from "#i18n/IErrorMappingTable.js";
import { i18n } from "#i18n/i18n.js";

/**
 * Zod v4의 prettifyError 레이아웃을 그대로 재현하면서 다국어 번역을 입히는 함수
 */
export function prettifyI18nError(
	error: z.ZodError,
	mappings: IErrorMappingTable,
): string {
	const lines: string[] = [];

	for (const issue of error.issues) {
		const path = issue.path ? issue.path.join(".") : "input";
		const specificKey = `${path}.${issue.code}`;

		// 💡 런타임 번역 처리
		let message = issue.message;
		if (mappings[specificKey]) message = i18n.t(mappings[specificKey]);
		else if (path && mappings[path]) message = i18n.t(mappings[path]);

		// 💡 Zod v4 prettifyError 특유의 터미널 레이아웃 그대로 조립
		lines.push(` - ${path}`);
		lines.push(`     ${chalk.red("✖")} ${message}`);
	}

	return lines.join("\n");
}

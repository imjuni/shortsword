import type { ArgsDef } from "citty";

export const buildArgs = {
	format: {
		type: "enum",
		alias: "f",
		options: ["html", "pdf", "md"],
		description: "format decision: eg. html, pdf, md(markdown)",
	},
	out: {
		type: "string",
		alias: "o",
		description: "Directory for builded output",
	},
} as const satisfies ArgsDef;

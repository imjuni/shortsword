import { loadConfig } from "c12";
import type { CommandContext } from "citty";
import { showUsage } from "citty";
import { consola } from "consola";
import defu from "defu";
import { urlna } from "url-naong";
import { i18n } from "#i18n/i18n.js";
import { prettifyI18nError } from "#i18n/prettifyI18nError.js";
import { Container } from "#modules/container.js";
import { buildZod } from "#schema/build.zod.js";
import { getBuildZodErrorMap } from "#schema/getBuildZodErrorMap.js";
import type { buildArgs } from "./buildArgs.js";

export const buildRun = async ({
	args,
	cmd,
}: CommandContext<typeof buildArgs>) => {
	const systemLocale = Intl.DateTimeFormat().resolvedOptions().locale ?? "en";
	i18n.locale(systemLocale.split("-").at(0) ?? "en");

	const { config: configFromFile } = await loadConfig({ name: "tceb" });
	const rawConfig = defu(args, configFromFile);
	const config = buildZod.safeParse(rawConfig);

	if (!config.success) {
		// display command usage
		await showUsage(cmd);

		// display error message using zod formattor
		console.error(prettifyI18nError(config.error, getBuildZodErrorMap()));

		process.exit(1);
	}

	const url = urlna("https://pokeapi.co", "/api/v2/pokemon/:name", {
		name: "ditto",
	});

	consola.info("evaluate url: ", url);
	consola.info(`Your format: ${config.data.format}`);
	consola.info(`Your output directory: ${config.data.out}`);

	const c = new Container("typescript cli boilerplate");

	consola.info(url);
	consola.info(`start typescript cli boilerplate: ${c.name}`);
};

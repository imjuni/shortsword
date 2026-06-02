import { defineCommand, runMain } from "citty";
import { install as sourceMapSupportInstall } from "source-map-support";
import { buildArgs } from "#commands/buildArgs.js";
import { buildRun } from "#commands/buildRun.js";
import "rosetta";

sourceMapSupportInstall();

const buildSubCommand = defineCommand({
	meta: { name: "build", description: "build sub command" },
	args: buildArgs,
	run: buildRun,
});

const main = defineCommand({
	meta: { name: "hello", version: "1.0.0", description: "My Awesome CLI App" },
	subCommands: { build: buildSubCommand },
});

runMain(main);

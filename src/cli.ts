import { defineCommand, runMain } from "citty";
import { readPackage } from "read-pkg";
import { install as sourceMapSupportInstall } from "source-map-support";
import { shortswordArgs } from "#commands/shortswordArgs.js";
import { shortswordRun } from "#commands/shortswordRun.js";

sourceMapSupportInstall();

const packageJson = await readPackage();

const main = defineCommand({
  meta: {
    name: packageJson.name,
    version: packageJson.version,
    description: packageJson.description,
  },
  args: shortswordArgs,
  run: shortswordRun,
});

runMain(main);

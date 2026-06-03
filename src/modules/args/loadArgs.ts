import { loadConfig } from "c12";
import { type CommandContext, showUsage } from "citty";
import defu from "defu";
import type z from "zod";
import type { shortswordArgs } from "#commands/shortswordArgs.js";
import { prettifyI18nError } from "#i18n/prettifyI18nError.js";
import { getShortswordZodErrorMap } from "#schemas/getShortswordZodErrorMap.js";
import { shortswordArgsZod } from "#schemas/shortswordArgsZod.js";

/**
 * load configuration file. And merge args and default value. Finally validation check
 * using Zod schema. If configuration is invalid, exit cli application.
 */
export async function loadArgs(
  args: CommandContext<typeof shortswordArgs>["args"],
  cmd: CommandContext<typeof shortswordArgs>["cmd"],
): Promise<
  Exclude<
    z.ZodSafeParseResult<z.infer<typeof shortswordArgsZod>>,
    { success: false }
  >
> {
  // load configuration file from the .shortswordrc, shortsword.config.ts, etc
  const { config: fileConfig } = await loadConfig({ name: "shortsword" });
  const rawConfig = defu(args, fileConfig);
  const config = shortswordArgsZod.safeParse(rawConfig);

  if (!config.success) {
    // display command usage
    await showUsage(cmd);

    // display error message using zod formattor
    console.error(prettifyI18nError(config.error, getShortswordZodErrorMap()));

    process.exit(1);
  }

  return config;
}

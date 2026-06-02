/* eslint-disable import/no-extraneous-dependencies */
import { defaultExclude, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		clearMocks: true,
		globals: true,
		typecheck: {
			checker: "tsc",
			tsconfig: "./tsconfig.json",
		},

		exclude: [...defaultExclude, "dist/**", "artifact/**", ".configs/**"],
	},
	esbuild: {
		target: "es2022", // 또는 "esnext"
	},
});

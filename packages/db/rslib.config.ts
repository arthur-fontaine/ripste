import { defineConfig } from "@rslib/core";

export default defineConfig({
	tools: {
		swc: {
			jsc: {
				transform: {
					decoratorMetadata: false,
				},
			},
		},
	},
	source: {
		entry: {
			"mikro-orm": "./src/adapters/mikro-orm/index.ts",
		},
	},
	lib: [{ format: "esm", dts: { bundle: true } }],
	output: {
		target: "node",
	},
});

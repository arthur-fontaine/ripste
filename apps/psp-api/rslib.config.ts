import { defineConfig } from "@rslib/core";

export default defineConfig({
	source: {
		entry: {
			client: "./src/client.ts",
		},
	},
	lib: [{ format: "esm", dts: { bundle: true } }],
	output: {
		target: "node",
	},
});

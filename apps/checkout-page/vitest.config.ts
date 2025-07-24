import { defineConfig } from "vitest/config";

export default defineConfig({
	server: {
		cors: false,
	},
	test: {
		setupFiles: ["./tests/setup.ts"],
	},
});

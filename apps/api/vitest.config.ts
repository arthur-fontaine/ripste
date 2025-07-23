import { defineConfig } from "vitest/config";

export default defineConfig({
	server: {
		cors: false,
	},
	test: {
		coverage: {
			include: ["src"],
		},
		env: {
			RESEND_API_KEY: "test-api-key",
		},
	},
});

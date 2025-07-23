import { testClient } from "hono/testing";
import { describe, it, expect, vi } from "vitest";
import { getApiClient } from "./test-utils/get-api-client.ts";

vi.mock("../src/email.ts", () => ({
	emailService: {
		sendRegistrationConfirmation: vi.fn(),
		sendPlatformAcceptance: vi.fn(),
		sendPlatformRejection: vi.fn(),
		sendCustomEmail: vi.fn(),
	},
}));

describe("Ping Endpoint", async () => {
	const { apiClient } = await getApiClient();

	it("should return ping response", async () => {
		const res = await apiClient.ping.$get();

		expect(res.status).toBe(200);
		expect(await res.json()).toEqual({
			message: "pong",
		});
	});
});

describe("Metrics Endpoint", async () => {
	const { app } = await import("../src/app.ts");
	const client = testClient(app);

	it("should return metrics", async () => {
		const res = await client.metrics.$get();

		expect(res.status).toBe(200);
		expect(await res.text()).toContain(
			"# HELP http_request_duration_seconds Duration of HTTP requests in seconds",
		);
	});
});

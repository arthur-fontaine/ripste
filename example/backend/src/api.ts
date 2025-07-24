import { createApiClient } from "@ripste/api/client";

export const apiClient = createApiClient(
	process.env["RIPSTE_API_URL"] || "http://localhost:3000",
);

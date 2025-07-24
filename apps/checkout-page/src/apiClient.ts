import { createApiClient } from "@ripste/api/client";

export const apiClient = createApiClient(
	import.meta.env["VITE_API_BASE_URL"] || "http://localhost:3000",
);

import { createApiClient } from "@ripste/api/client";

export const apiClient = createApiClient(import.meta.env["VITE_API_URL"] || "http://localhost:3000/api");
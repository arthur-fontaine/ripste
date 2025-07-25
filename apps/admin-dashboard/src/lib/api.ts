import { createApiClient } from "@ripste/api/client";
import { apiUrl } from "./apiUrl.ts";

export const apiClient = createApiClient(apiUrl);

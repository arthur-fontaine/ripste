import { initializeDevelopmentDatabase } from "../database-dev.ts";

export async function setupDatabase() {
	await initializeDevelopmentDatabase();
}

await setupDatabase();

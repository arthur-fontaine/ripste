import { initializeTestDatabase } from "./database-utils.ts";

export async function setupDatabase() {
	await initializeTestDatabase();
}

import { MikroOrmDatabase, type IDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";

let database: IDatabase | null = null;

export async function initializeTestDatabase(): Promise<IDatabase> {
	if (database) {
		return database;
	}

	const options = {
		debug: true,
		allowGlobalContext: true,
		strict: false,
		forceEntityConstructor: true,
	};

	try {
		database = await MikroOrmDatabase.create(SqliteDriver, ":memory:", options);
		return database;
	} catch (error) {
		console.error("Failed to initialize test database:", error);
		throw error;
	}
}

export async function closeTestDatabase(): Promise<void> {
	database = null;
}

export function getTestDatabaseInstance(): IDatabase {
	if (!database) {
		throw new Error(
			"Test database not initialized. Call initializeTestDatabase() first.",
		);
	}
	return database;
}

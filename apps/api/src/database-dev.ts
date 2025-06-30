import { MikroOrmDatabase, type IDatabase } from "@ripste/db/mikro-orm";
import { SqliteDriver } from "@mikro-orm/sqlite";

let database: IDatabase | null = null;

export async function initializeDevelopmentDatabase(): Promise<IDatabase> {
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
		database = await MikroOrmDatabase.create(
			SqliteDriver,
			":memory:",
			options,
		);
		return database;
	} catch (error) {
		console.error("Failed to initialize development database:", error);
		throw error;
	}
}

export async function closeDevelopmentDatabase(): Promise<void> {
	database = null;
}

export function createDevelopmentDatabaseInstance(): IDatabase {
	if (!database) {
		throw new Error(
			"Development database not initialized. Call initializeDevelopmentDatabase() first.",
		);
	}
	return database;
}

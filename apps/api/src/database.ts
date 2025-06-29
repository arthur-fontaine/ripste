import { MikroOrmDatabase, type IDatabase } from "@ripste/db/mikro-orm";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
	initializeDevelopmentDatabase,
	closeDevelopmentDatabase,
	createDevelopmentDatabaseInstance,
} from "./database-dev.ts";

let database: IDatabase | null = null;
const isDevelopment =
	process.env["NODE_ENV"] === "development" ||
	process.env["NODE_ENV"] === "test";

export async function initializeDatabase(): Promise<IDatabase> {
	if (database) {
		return database;
	}

	if (isDevelopment) {
		return await initializeDevelopmentDatabase();
	}

	const dbName = process.env["POSTGRES_DB"] || "ripste";
	const options = {
		host: process.env["DB_HOST"] || "localhost",
		port: Number(process.env["POSTGRES_PORT"]) || 5432,
		user: process.env["POSTGRES_USER"] || "ripste",
		password: process.env["POSTGRES_PASSWORD"] || "your_secure_password_here",
		debug: process.env["NODE_ENV"] !== "production",
		allowGlobalContext: true,
		forceEntityConstructor: true,
	};

	try {
		database = await MikroOrmDatabase.create(PostgreSqlDriver, dbName, options);
		return database;
	} catch (error) {
		console.error("Failed to initialize database:", error);
		throw error;
	}
}

export async function getDatabaseConnection(): Promise<IDatabase> {
	if (!database) {
		return await initializeDatabase();
	}
	return database;
}

export async function closeDatabase(): Promise<void> {
	if (isDevelopment) {
		await closeDevelopmentDatabase();
		return;
	}

	database = null;
}

export function createDatabaseInstance(): IDatabase {
	if (isDevelopment) {
		return createDevelopmentDatabaseInstance();
	}

	if (!database) {
		throw new Error(
			"Database not initialized. Call initializeDatabase() first.",
		);
	}

	return database;
}

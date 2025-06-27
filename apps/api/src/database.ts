import { MikroORM, type EntityClass } from "@mikro-orm/postgresql";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import type { IDatabase } from "../../../packages/db/src/domain/ports/IDatabase.ts";
import { 
	initializeDevelopmentDatabase, 
	closeDevelopmentDatabase, 
	createDevelopmentDatabaseInstance,
	createDevelopmentEntityManager
} from "./database-dev.ts";

import { MikroOrmAccountModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmAccountModel.ts";
import { MikroOrmApiCredentialModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmApiCredentialModel.ts";
import { MikroOrmCheckoutPageModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmCheckoutPageModel.ts";
import { MikroOrmCheckoutThemeModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmCheckoutThemeModel.ts";
import { MikroOrmCompanyModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmCompanyModel.ts";
import { MikroOrmJwtTokenModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmJwtTokenModel.ts";
import { MikroOrmOauth2ClientModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmOauth2ClientModel.ts";
import { MikroOrmPaymentAttemptModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmPaymentAttemptModel.ts";
import { MikroOrmRefundModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmRefundModel.ts";
import { MikroOrmSessionModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmSessionModel.ts";
import { MikroOrmStoreMemberModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmStoreMemberModel.ts";
import { MikroOrmStoreModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmStoreModel.ts";
import { MikroOrmStoreStatusModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmStoreStatusModel.ts";
import { MikroOrmThemeCustomizationModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmThemeCustomizationModel.ts";
import { MikroOrmTransactionEventModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmTransactionEventModel.ts";
import { MikroOrmTransactionModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmTransactionModel.ts";
import { MikroOrmUserModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmUserModel.ts";
import { MikroOrmUserProfileModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmUserProfileModel.ts";
import { MikroOrmVerificationModel } from "../../../packages/db/src/adapters/mikro-orm/models/MikroOrmVerificationModel.ts";

function getEntities(): EntityClass<unknown>[] {
	return [
		MikroOrmAccountModel,
		MikroOrmApiCredentialModel,
		MikroOrmCheckoutPageModel,
		MikroOrmCheckoutThemeModel,
		MikroOrmCompanyModel,
		MikroOrmJwtTokenModel,
		MikroOrmOauth2ClientModel,
		MikroOrmPaymentAttemptModel,
		MikroOrmRefundModel,
		MikroOrmSessionModel,
		MikroOrmStoreMemberModel,
		MikroOrmStoreModel,
		MikroOrmStoreStatusModel,
		MikroOrmThemeCustomizationModel,
		MikroOrmTransactionEventModel,
		MikroOrmTransactionModel,
		MikroOrmUserModel,
		MikroOrmUserProfileModel,
		MikroOrmVerificationModel,
	];
}

let orm: MikroORM | null = null;
let database: IDatabase | null = null;
const isDevelopment = process.env["NODE_ENV"] === "development" || process.env["NODE_ENV"] === "test";

export async function initializeDatabase(): Promise<IDatabase> {
	if (database) {
		return database;
	}

	if (isDevelopment) {
		return await initializeDevelopmentDatabase();
	}

	const entities = getEntities();

	const config = {
		entities,
		dbName: process.env["POSTGRES_DB"] || "ripste",
		host: process.env["DB_HOST"] || "localhost",
		port: Number(process.env["POSTGRES_PORT"]) || 5432,
		user: process.env["POSTGRES_USER"] || "ripste",
		password: process.env["POSTGRES_PASSWORD"] || "your_secure_password_here",
		debug: process.env["NODE_ENV"] !== "production",
		allowGlobalContext: true,
		forceEntityConstructor: true,
	};

	try {
		orm = await MikroORM.init(config);

		if (process.env["NODE_ENV"] === "development") {
			await orm.schema.refreshDatabase();
		}

		database = new MikroOrmDatabase(orm.em);
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

	if (orm) {
		await orm.close();
		orm = null;
		database = null;
	}
}

export function createEntityManager() {
	if (isDevelopment) {
		return createDevelopmentEntityManager();
	}

	if (!orm) {
		throw new Error("Database not initialized. Call initializeDatabase() first.");
	}
	return orm.em.fork();
}

export function createDatabaseInstance(): IDatabase {
	if (isDevelopment) {
		return createDevelopmentDatabaseInstance();
	}

	const em = createEntityManager();
	return new MikroOrmDatabase(em);
}

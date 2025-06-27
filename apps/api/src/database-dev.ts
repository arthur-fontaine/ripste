import { MikroORM, type EntityClass } from "@mikro-orm/sqlite";
import { MikroOrmDatabase } from "@ripste/db/mikro-orm";
import type { IDatabase } from "../../../packages/db/src/domain/ports/IDatabase.ts";

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

export async function initializeDevelopmentDatabase(): Promise<IDatabase> {
	if (database) {
		return database;
	}

	const entities = getEntities();

	const config = {
		entities,
		dbName: ":memory:",
		debug: true,
		allowGlobalContext: true,
		forceEntityConstructor: true,
	};

	try {
		orm = await MikroORM.init(config);

		await orm.schema.refreshDatabase();

		database = new MikroOrmDatabase(orm.em);
		return database;
	} catch (error) {
		console.error("Failed to initialize development database:", error);
		throw error;
	}
}

export async function closeDevelopmentDatabase(): Promise<void> {
	if (orm) {
		await orm.close();
		orm = null;
		database = null;
	}
}

export function createDevelopmentEntityManager() {
	if (!orm) {
		throw new Error("Development database not initialized. Call initializeDevelopmentDatabase() first.");
	}
	return orm.em.fork();
}

export function createDevelopmentDatabaseInstance(): IDatabase {
	const em = createDevelopmentEntityManager();
	return new MikroOrmDatabase(em);
}

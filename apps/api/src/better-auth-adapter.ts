import { createAdapter, type AdapterDebugLogs } from "better-auth/adapters";
import type { IDatabase } from "../../../packages/db/src/domain/ports/IDatabase.ts";
import type {
	IInsertUser,
	IUser,
} from "../../../packages/db/src/domain/models/IUser.ts";
import type {
	IInsertSession,
	ISession,
} from "../../../packages/db/src/domain/models/ISession.ts";
import type {
	IInsertAccount,
	IAccount,
} from "../../../packages/db/src/domain/models/IAccount.ts";
import type {
	IInsertVerification,
	IVerification,
} from "../../../packages/db/src/domain/models/IVerification.ts";

interface BetterAuthUser {
	id?: string;
	email: string;
	password?: string;
	emailVerified?: boolean;
	name?: string | null;
	image?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

interface BetterAuthSession {
	id?: string;
	token: string;
	userId: string;
	expiresAt: Date;
	ipAddress?: string | null;
	userAgent?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

interface BetterAuthAccount {
	id?: string;
	userId: string;
	accountId: string;
	providerId: string;
	accessToken?: string | null;
	refreshToken?: string | null;
	idToken?: string | null;
	accessTokenExpiresAt?: Date | null;
	refreshTokenExpiresAt?: Date | null;
	scope?: string | null;
	password?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

interface BetterAuthVerification {
	id?: string;
	identifier: string;
	value: string;
	expiresAt: Date;
	type: "email" | "phone" | "otp" | "password-reset";
	createdAt?: Date;
	updatedAt?: Date;
}

type BetterAuthData =
	| BetterAuthUser
	| BetterAuthSession
	| BetterAuthAccount
	| BetterAuthVerification;
type DatabaseEntity = IUser | ISession | IAccount | IVerification;
type InsertData =
	| IInsertUser
	| IInsertSession
	| IInsertAccount
	| IInsertVerification;

type WhereCondition = {
	field: string;
	value: unknown;
	operator?: string;
};

type DebugLogFunction = (
	operation: string,
	data: Record<string, unknown>,
) => void;

// Your custom adapter config options
export interface CustomDatabaseAdapterConfig {
	/**
	 * Enable debug logs for the adapter
	 * @default false
	 */
	debugLogs?: AdapterDebugLogs;
}

export const customDatabaseAdapter = (
	db: IDatabase,
	config: CustomDatabaseAdapterConfig = {},
) => {
	const adapterConfig = {
		adapterId: "custom-database",
		adapterName: "Custom Database Adapter",
		usePlural: false,
		debugLogs: config?.debugLogs ?? false,
		supportsJSON: true,
		supportsDates: true,
		supportsBooleans: true,
		supportsNumericIds: false,
		disableIdGeneration: false,
	};

	const adapterFunction = ({ debugLog }: { debugLog: DebugLogFunction }) => {
		async function insertEntity(
			model: string,
			data: InsertData,
		): Promise<DatabaseEntity> {
			switch (model) {
				case "user":
					return await db.user.insert(data as IInsertUser);
				case "session":
					return await db.session.insert(data as IInsertSession);
				case "account":
					return await db.account.insert(data as IInsertAccount);
				case "verification":
					return await db.verification.insert(data as IInsertVerification);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function updateEntity(
			model: string,
			id: string,
			data: Partial<InsertData>,
		): Promise<DatabaseEntity | null> {
			switch (model) {
				case "user":
					return await db.user.update(id, data as Partial<IInsertUser>);
				case "session":
					return await db.session.update(id, data as Partial<IInsertSession>);
				case "account":
					return await db.account.update(id, data as Partial<IInsertAccount>);
				case "verification":
					return await db.verification.update(
						id,
						data as Partial<IInsertVerification>,
					);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function findOneEntity(
			model: string,
			id: string,
		): Promise<DatabaseEntity | null> {
			switch (model) {
				case "user":
					return await db.user.findOne(id);
				case "session":
					return await db.session.findOne(id);
				case "account":
					return await db.account.findOne(id);
				case "verification":
					return await db.verification.findOne(id);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function findManyEntities(
			model: string,
			query: Record<string, unknown> = {},
		): Promise<DatabaseEntity[]> {
			switch (model) {
				case "user":
					return await db.user.findMany(query);
				case "session":
					return await db.session.findMany(query);
				case "account": {
					let transformedQuery = { ...query };
					if (transformedQuery["userId"]) {
						const { userId, ...rest } = transformedQuery;
						transformedQuery = { ...rest, user: userId };
					}
					return await db.account.findMany(transformedQuery);
				}
				case "verification":
					return await db.verification.findMany(query);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function deleteEntity(model: string, id: string): Promise<void> {
			switch (model) {
				case "user":
					await db.user.delete(id);
					break;
				case "session":
					await db.session.delete(id);
					break;
				case "account":
					await db.account.delete(id);
					break;
				case "verification":
					await db.verification.delete(id);
					break;
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		function mapEntityToBetterAuth(
			entity: DatabaseEntity | null,
			model: string,
		): BetterAuthData | null {
			if (!entity) return null;

			switch (model) {
				case "user": {
					const userEntity = entity as IUser;
					return {
						id: userEntity.id,
						name:
							userEntity.profile?.fullName ||
							`${userEntity.profile?.firstName || ""} ${userEntity.profile?.lastName || ""}`.trim() ||
							null,
						email: userEntity.email,
						emailVerified: userEntity.emailVerified,
						image: null,
						createdAt: userEntity.createdAt,
						updatedAt: userEntity.updatedAt,
					} as BetterAuthUser;
				}
				case "session": {
					const sessionEntity = entity as ISession;
					return {
						id: sessionEntity.id,
						token: sessionEntity.token,
						userId: sessionEntity.userId,
						expiresAt: sessionEntity.expiresAt,
						ipAddress: sessionEntity.ipAddress,
						userAgent: sessionEntity.userAgent,
						createdAt: sessionEntity.createdAt,
						updatedAt: sessionEntity.updatedAt,
					} as BetterAuthSession;
				}
				case "account": {
					const accountEntity = entity as IAccount;
					return {
						id: accountEntity.id,
						userId: accountEntity.userId,
						accountId: accountEntity.accountId,
						providerId: accountEntity.providerId,
						accessToken: accountEntity.accessToken,
						refreshToken: accountEntity.refreshToken,
						idToken: accountEntity.idToken,
						accessTokenExpiresAt: accountEntity.accessTokenExpiresAt,
						refreshTokenExpiresAt: accountEntity.refreshTokenExpiresAt,
						scope: accountEntity.scope,
						password: accountEntity.password,
						createdAt: accountEntity.createdAt,
						updatedAt: accountEntity.updatedAt,
					} as BetterAuthAccount;
				}
				case "verification": {
					const verificationEntity = entity as IVerification;
					return {
						id: verificationEntity.id,
						identifier: verificationEntity.identifier,
						value: verificationEntity.value,
						expiresAt: verificationEntity.expiresAt,
						type: verificationEntity.type,
						createdAt: verificationEntity.createdAt,
						updatedAt: verificationEntity.updatedAt,
					} as BetterAuthVerification;
				}
				default:
					return entity as BetterAuthData;
			}
		}

		function mapBetterAuthToEntity(
			data: Record<string, unknown>,
			model: string,
		): InsertData {
			switch (model) {
				case "user": {
					return {
						email: data["email"] as string,
						passwordHash: (data["password"] as string) || "",
						emailVerified: (data["emailVerified"] as boolean) || false,
						permissionLevel: "user" as const,
					} as IInsertUser;
				}
				case "session": {
					return {
						token: data["token"] as string,
						userId: data["userId"] as string,
						expiresAt: data["expiresAt"] as Date,
						ipAddress: data["ipAddress"] as string | null,
						userAgent: data["userAgent"] as string | null,
					} as IInsertSession;
				}
				case "account": {
					const accountData = {
						userId: data["userId"] as string,
						accountId: data["accountId"] as string,
						providerId: data["providerId"] as string,
						accessToken: data["accessToken"] as string | null,
						refreshToken: data["refreshToken"] as string | null,
						idToken: data["idToken"] as string | null,
						accessTokenExpiresAt: data["accessTokenExpiresAt"] as Date | null,
						refreshTokenExpiresAt: data["refreshTokenExpiresAt"] as Date | null,
						scope: data["scope"] as string | null,
						password: data["password"] as string | null,
					} as IInsertAccount;
					return accountData;
				}
				case "verification": {
					return {
						identifier: data["identifier"] as string,
						value: data["value"] as string,
						expiresAt: data["expiresAt"] as Date,
						type: data["type"] as "email" | "phone" | "otp" | "password-reset",
					} as IInsertVerification;
				}
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		return {
			create: async <T extends Record<string, unknown>>({
				data,
				model,
				select,
			}: {
				data: T;
				model: string;
				select?: string[];
			}): Promise<T> => {
				debugLog("create", { model, data, select });

				const mappedData = mapBetterAuthToEntity(data, model);
				const result = await insertEntity(model, mappedData);
				return { ...data, id: result.id } as T;
			},

			update: async <T>({
				model,
				where,
				update,
			}: {
				model: string;
				where: WhereCondition[];
				update: T;
			}): Promise<T | null> => {
				debugLog("update", { model, where, update });

				const whereCondition = where.find(
					(w: WhereCondition) => w.field === "id",
				);
				if (!whereCondition) {
					throw new Error("Update requires ID field");
				}

				const mappedUpdate = mapBetterAuthToEntity(
					update as DatabaseEntity,
					model,
				);
				const result = await updateEntity(
					model,
					whereCondition.value as string,
					mappedUpdate,
				);

				return result ? ({ ...update, id: whereCondition.value } as T) : null;
			},

			updateMany: async <T>({
				model,
				where,
				update,
			}: {
				model: string;
				where: WhereCondition[];
				update: T;
			}): Promise<number> => {
				debugLog("updateMany", { model, where, update });

				throw new Error("updateMany not implemented yet");
			},

			findOne: async <T>({
				model,
				where,
				select,
			}: {
				model: string;
				where: WhereCondition[];
				select?: string[];
			}): Promise<T | null> => {
				debugLog("findOne", { model, where, select });

				const whereCondition = where.find(
					(w: WhereCondition) => w.field === "id",
				);
				if (whereCondition) {
					const result = await findOneEntity(
						model,
						whereCondition.value as string,
					);
					return result ? (mapEntityToBetterAuth(result, model) as T) : null;
				}

				const emailCondition = where.find(
					(w: WhereCondition) => w.field === "email",
				);
				if (emailCondition && model === "user") {
					const users = await findManyEntities(model, {
						email: emailCondition.value as string,
					});
					const user = users[0];
					return user ? (mapEntityToBetterAuth(user, model) as T) : null;
				}

				if (model === "account") {
					const userIdCondition = where.find(
						(w: WhereCondition) => w.field === "userId",
					);
					const providerIdCondition = where.find(
						(w: WhereCondition) => w.field === "providerId",
					);

					if (userIdCondition && providerIdCondition) {
						const accounts = await findManyEntities(model, {
							userId: userIdCondition.value as string,
							providerId: providerIdCondition.value as string,
						});
						const account = accounts[0];
						return account
							? (mapEntityToBetterAuth(account, model) as T)
							: null;
					}

					if (userIdCondition) {
						const accounts = await findManyEntities(model, {
							userId: userIdCondition.value as string,
						});
						const account = accounts[0];
						return account
							? (mapEntityToBetterAuth(account, model) as T)
							: null;
					}
				}

				if (model === "session") {
					const tokenCondition = where.find(
						(w: WhereCondition) => w.field === "token",
					);
					const userIdCondition = where.find(
						(w: WhereCondition) => w.field === "userId",
					);

					if (tokenCondition) {
						const sessions = await findManyEntities(model, {
							token: tokenCondition.value as string,
						});
						const session = sessions[0];
						return session
							? (mapEntityToBetterAuth(session, model) as T)
							: null;
					}

					if (userIdCondition) {
						const sessions = await findManyEntities(model, {
							userId: userIdCondition.value as string,
						});
						const session = sessions[0];
						return session
							? (mapEntityToBetterAuth(session, model) as T)
							: null;
					}
				}

				debugLog("Unhandled findOne conditions", {
					model,
					where,
				});
				return null;
			},

			findMany: async <T>({
				model,
				where,
				limit,
				sortBy,
				offset,
			}: {
				model: string;
				where?: WhereCondition[];
				limit?: number;
				sortBy?: { field: string; direction: "asc" | "desc" };
				offset?: number;
			}): Promise<T[]> => {
				debugLog("findMany", { model, where, limit, sortBy, offset });

				const query: Record<string, unknown> = {};
				if (where && where.length > 0) {
					for (const condition of where) {
						query[condition.field] = condition.value;
					}
				}

				const results = await findManyEntities(model, query);

				return results.map(
					(result: DatabaseEntity) => mapEntityToBetterAuth(result, model) as T,
				);
			},

			delete: async ({
				model,
				where,
			}: { model: string; where: WhereCondition[] }): Promise<void> => {
				debugLog("delete", { model, where });

				const whereCondition = where.find(
					(w: WhereCondition) => w.field === "id",
				);
				if (!whereCondition) {
					throw new Error("Delete requires ID field");
				}

				await deleteEntity(model, whereCondition.value as string);
			},

			deleteMany: async ({
				model,
				where,
			}: { model: string; where: WhereCondition[] }): Promise<number> => {
				debugLog("deleteMany", { model, where });

				throw new Error("deleteMany not implemented yet");
			},

			count: async ({
				model,
				where,
			}: { model: string; where?: WhereCondition[] }): Promise<number> => {
				debugLog("count", { model, where });

				const query: Record<string, unknown> = {};
				if (where && where.length > 0) {
					for (const condition of where) {
						query[condition.field] = condition.value;
					}
				}

				const results = await findManyEntities(model, query);
				return results.length;
			},
		};
	};

	// Return both the config and adapter function for testing
	// The createAdapter call will be made by Better Auth when using this adapter
	return {
		config: adapterConfig,
		adapter: adapterFunction,
		// This is the actual function that Better Auth expects
		createAdapter: () =>
			createAdapter({
				config: adapterConfig,
				adapter: adapterFunction,
			}),
	};
};

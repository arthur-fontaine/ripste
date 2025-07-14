import { createAdapter, type AdapterDebugLogs } from "better-auth/adapters";
import type {
	IDatabase,
	IInsertUser,
	IUser,
	IInsertSession,
	ISession,
	IInsertAccount,
	IAccount,
	IInsertVerification,
	IVerification,
	IOAuthApplication,
	IInsertOAuthApplication,
	IOAuthAccessToken,
	IInsertOAuthAccessToken,
	IOAuthConsent,
	IInsertOAuthConsent,
} from "@ripste/db/mikro-orm";

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

interface BetterAuthOAuthApplication {
	id?: string;
	clientId: string;
	clientSecret: string;
	name: string;
	redirectURLs: string;
	metadata?: string | null;
	type: string;
	disabled: boolean;
	userId?: string | null;
	createdAt?: Date;
	updatedAt?: Date;
}

interface BetterAuthOAuthAccessToken {
	id?: string;
	accessToken: string;
	refreshToken: string;
	accessTokenExpiresAt: Date;
	refreshTokenExpiresAt: Date;
	clientId: string;
	userId: string;
	scopes: string;
	createdAt?: Date;
	updatedAt?: Date;
}

interface BetterAuthOAuthConsent {
	id?: string;
	userId: string;
	clientId: string;
	scopes: string;
	consentGiven: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

type BetterAuthData =
	| BetterAuthUser
	| BetterAuthSession
	| BetterAuthAccount
	| BetterAuthVerification
	| BetterAuthOAuthApplication
	| BetterAuthOAuthAccessToken
	| BetterAuthOAuthConsent;
type DatabaseEntity = IUser | ISession | IAccount | IVerification | IOAuthApplication | IOAuthAccessToken | IOAuthConsent;
type InsertData =
	| IInsertUser
	| IInsertSession
	| IInsertAccount
	| IInsertVerification
	| IInsertOAuthApplication
	| IInsertOAuthAccessToken
	| IInsertOAuthConsent;

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
	/**
	 * Field mappings for different models
	 */
	fieldMappings?: {
		user?: Record<string, string>;
		session?: Record<string, string>;
		account?: Record<string, string>;
		verification?: Record<string, string>;
		oauthApplication?: Record<string, string>;
		oauthAccessToken?: Record<string, string>;
		oauthConsent?: Record<string, string>;
	};
	/**
	 * Custom ID generation function
	 */
	generateId?: () => string;
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
		generateId: config?.generateId,
	};

	// Helper function to get field mappings
	const getFieldMappings = (model: string): Record<string, string> => {
		return (
			config.fieldMappings?.[model as keyof typeof config.fieldMappings] || {}
		);
	};

	// Helper function to map field names from Better Auth to database
	const mapFieldName = (fieldName: string, model: string): string => {
		const mappings = getFieldMappings(model);
		return mappings[fieldName] || fieldName;
	};

	const adapterFunction = ({ debugLog }: { debugLog: DebugLogFunction }) => {
		async function insertEntity(
			model: string,
			data: InsertData,
		): Promise<DatabaseEntity> {
			switch (model) {
				case "user": {
					const userData = data as IInsertUser;
					// @ts-expect-error - temporary storage for name
					const name = userData._tempName as string | undefined;

					const user = await db.user.insert(userData);

					if (name) {
						const nameParts = name.split(" ");
						const firstName = nameParts[0] || "";
						const lastName = nameParts.slice(1).join(" ") || "";

						await db.userProfile.insert({
							firstName,
							lastName,
							fullName: name,
							phone: null,
							user: user.id,
						} as any);
					}

					return user;
				}
				case "session":
					return await db.session.insert(data as IInsertSession);
				case "account":
					return await db.account.insert(data as IInsertAccount);
				case "verification":
					return await db.verification.insert(data as IInsertVerification);
				case "oauthApplication":
					return await db.oauthApplication.insert(data as IInsertOAuthApplication);
				case "oauthAccessToken":
					return await db.oauthAccessToken.insert(data as IInsertOAuthAccessToken);
				case "oauthConsent":
					return await db.oauthConsent.insert(data as IInsertOAuthConsent);
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
				case "user": {
					const userData = data as Partial<IInsertUser>;
					// @ts-expect-error - temporary storage for name
					const name = userData._tempName as string | undefined;

					const user = await db.user.update(id, userData);

					if (name && user) {
						const nameParts = name.split(" ");
						const firstName = nameParts[0] || "";
						const lastName = nameParts.slice(1).join(" ") || "";

						const existingProfile = user.profile;
						if (existingProfile) {
							await db.userProfile.update(existingProfile.id, {
								firstName,
								lastName,
								fullName: name,
							} as any);
						} else {
							await db.userProfile.insert({
								firstName,
								lastName,
								fullName: name,
								phone: null,
								user: user.id,
							} as any);
						}
					}

					return user;
				}
				case "session":
					return await db.session.update(id, data as Partial<IInsertSession>);
				case "account":
					return await db.account.update(id, data as Partial<IInsertAccount>);
				case "verification":
					return await db.verification.update(
						id,
						data as Partial<IInsertVerification>,
					);
				case "oauthApplication":
					return await db.oauthApplication.update(
						id,
						data as Partial<IInsertOAuthApplication>,
					);
				case "oauthAccessToken":
					return await db.oauthAccessToken.update(
						id,
						data as Partial<IInsertOAuthAccessToken>,
					);
				case "oauthConsent":
					return await db.oauthConsent.update(
						id,
						data as Partial<IInsertOAuthConsent>,
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
				case "oauthApplication":
					return await db.oauthApplication.findOne(id);
				case "oauthAccessToken":
					return await db.oauthAccessToken.findOne(id);
				case "oauthConsent":
					return await db.oauthConsent.findOne(id);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function findManyEntities(
			model: string,
			query: Record<string, unknown> = {},
		): Promise<DatabaseEntity[]> {
			switch (model) {
				case "user": {
					if (query["name"]) {
						const nameValue = query["name"] as string;
						const { name, ...restQuery } = query;

						const users = await db.user.findMany(restQuery);

						return users.filter((user: IUser) => {
							const fullName = user.profile?.fullName;
							const firstName = user.profile?.firstName;
							const lastName = user.profile?.lastName;
							const computedName =
								fullName ||
								`${firstName || ""} ${lastName || ""}`.trim() ||
								null;

							return computedName === nameValue;
						});
					}

					return await db.user.findMany(query);
				}
				case "session": {
					let transformedQuery = { ...query };
					if (transformedQuery["userId"]) {
						const { userId, ...rest } = transformedQuery;
						transformedQuery = { ...rest, user: userId };
					}
					return await db.session.findMany(transformedQuery);
				}
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
				case "oauthApplication":
					return await db.oauthApplication.findMany(query);
				case "oauthAccessToken":
					return await db.oauthAccessToken.findMany(query);
				case "oauthConsent":
					return await db.oauthConsent.findMany(query);
				default:
					throw new Error(`Unknown model: ${model}`);
			}
		}

		async function deleteEntity(model: string, id: string): Promise<void> {
			try {
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
					case "oauthApplication":
						await db.oauthApplication.delete(id);
						break;
					case "oauthAccessToken":
						await db.oauthAccessToken.delete(id);
						break;
					case "oauthConsent":
						await db.oauthConsent.delete(id);
						break;
					default:
						throw new Error(`Unknown model: ${model}`);
				}
			} catch (error) {
				if (
					error instanceof Error &&
					error.message.includes("Entity not found")
				) {
					return;
				}
				throw error;
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
					const result: BetterAuthUser = {
						id: userEntity.id,
						name:
							userEntity.profile?.fullName ||
							`${userEntity.profile?.firstName || ""} ${userEntity.profile?.lastName || ""}`.trim() ||
							null,
						email: userEntity.email,
						emailVerified: userEntity.emailVerified,
						image: null,
						createdAt: userEntity.createdAt,
						updatedAt: userEntity.updatedAt || userEntity.createdAt,
					};

					const mappings = getFieldMappings(model);
					const mappedResult: Record<string, unknown> = {};

					for (const [key, value] of Object.entries(result)) {
						const mappedFieldName = Object.entries(mappings).find(
							([betterAuthField]) => betterAuthField === key,
						)?.[1];

						if (mappedFieldName) {
							mappedResult[mappedFieldName] = value;
						} else {
							mappedResult[key] = value;
						}
					}

					return mappedResult as unknown as BetterAuthUser;
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
				case "oauthApplication": {
					const appEntity = entity as IOAuthApplication;
					return {
						id: appEntity.id,
						clientId: appEntity.clientId,
						clientSecret: appEntity.clientSecret,
						name: appEntity.name,
						redirectURLs: appEntity.redirectURLs,
						metadata: appEntity.metadata,
						type: appEntity.type,
						disabled: appEntity.disabled,
						userId: appEntity.userId,
						createdAt: appEntity.createdAt,
						updatedAt: appEntity.updatedAt,
					} as BetterAuthOAuthApplication;
				}
				case "oauthAccessToken": {
					const tokenEntity = entity as IOAuthAccessToken;
					return {
						id: tokenEntity.id,
						accessToken: tokenEntity.accessToken,
						refreshToken: tokenEntity.refreshToken,
						accessTokenExpiresAt: tokenEntity.accessTokenExpiresAt,
						refreshTokenExpiresAt: tokenEntity.refreshTokenExpiresAt,
						clientId: tokenEntity.clientId,
						userId: tokenEntity.userId,
						scopes: tokenEntity.scopes,
						createdAt: tokenEntity.createdAt,
						updatedAt: tokenEntity.updatedAt,
					} as BetterAuthOAuthAccessToken;
				}
				case "oauthConsent": {
					const consentEntity = entity as IOAuthConsent;
					return {
						id: consentEntity.id,
						userId: consentEntity.userId,
						clientId: consentEntity.clientId,
						scopes: consentEntity.scopes,
						consentGiven: consentEntity.consentGiven,
						createdAt: consentEntity.createdAt,
						updatedAt: consentEntity.updatedAt,
					} as BetterAuthOAuthConsent;
				}
				default:
					return entity as BetterAuthData;
			}
		}

		function mapBetterAuthToEntity(
			data: Record<string, unknown>,
			model: string,
			isUpdate = false,
		): InsertData {
			const mappings = getFieldMappings(model);

			switch (model) {
				case "user": {
					const userData: Partial<IInsertUser> & { id?: string } = {};

					if (data["id"] !== undefined) {
						userData.id = data["id"] as string;
					}

					if (data["email"] !== undefined) {
						userData.email = data["email"] as string;
					} else {
						for (const [betterAuthField, dbField] of Object.entries(mappings)) {
							if (betterAuthField === "email" && data[dbField] !== undefined) {
								userData.email = data[dbField] as string;
								break;
							}
						}
					}

					if (data["password"] !== undefined) {
						userData.passwordHash = data["password"] as string;
					}
					if (data["emailVerified"] !== undefined) {
						userData.emailVerified = data["emailVerified"] as boolean;
					}

					if (data["name"] !== undefined) {
						// @ts-expect-error - temporary storage for name
						userData._tempName = data["name"] as string;
					}

					if (!isUpdate) {
						userData.email = userData.email || "";
						userData.passwordHash = userData.passwordHash || "";
						userData.emailVerified = userData.emailVerified || false;
						userData.permissionLevel = "user" as const;
					}

					return userData as IInsertUser;
				}
				case "session": {
					return {
						id: data["id"] as string | undefined,
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
				case "oauthApplication": {
					return {
						id: data["id"] as string | undefined,
						clientId: data["clientId"] as string,
						clientSecret: data["clientSecret"] as string,
						name: data["name"] as string,
						redirectURLs: data["redirectURLs"] as string,
						metadata: data["metadata"] as string | null,
						type: data["type"] as string,
						disabled: data["disabled"] as boolean,
						userId: data["userId"] as string | null,
					} as IInsertOAuthApplication;
				}
				case "oauthAccessToken": {
					return {
						id: data["id"] as string | undefined,
						accessToken: data["accessToken"] as string,
						refreshToken: data["refreshToken"] as string,
						accessTokenExpiresAt: data["accessTokenExpiresAt"] as Date,
						refreshTokenExpiresAt: data["refreshTokenExpiresAt"] as Date,
						clientId: data["clientId"] as string,
						userId: data["userId"] as string,
						scopes: data["scopes"] as string,
					} as IInsertOAuthAccessToken;
				}
				case "oauthConsent": {
					return {
						id: data["id"] as string | undefined,
						userId: data["userId"] as string,
						clientId: data["clientId"] as string,
						scopes: data["scopes"] as string,
						consentGiven: data["consentGiven"] as boolean,
					} as IInsertOAuthConsent;
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

				const processedData: Record<string, unknown> = { ...data };
				if (config.generateId) {
					processedData["id"] = config.generateId();
				}

				const mappedData = mapBetterAuthToEntity(processedData, model, false);
				const result = await insertEntity(model, mappedData);
				const mappedResult = mapEntityToBetterAuth(result, model);
				return mappedResult as unknown as T;
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
					true,
				);
				const result = await updateEntity(
					model,
					whereCondition.value as string,
					mappedUpdate,
				);

				if (!result) return null;
				const mappedResult = mapEntityToBetterAuth(result, model);
				return mappedResult as unknown as T;
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

				const query: Record<string, unknown> = {};
				if (where && where.length > 0) {
					for (const condition of where) {
						query[condition.field] = condition.value;
					}
				}

				const entitiesToUpdate = await findManyEntities(model, query);

				const mappedUpdate = mapBetterAuthToEntity(
					update as DatabaseEntity,
					model,
					true,
				);
				let updatedCount = 0;

				for (const entity of entitiesToUpdate) {
					const result = await updateEntity(model, entity.id, mappedUpdate);
					if (result) {
						updatedCount++;
					}
				}

				return updatedCount;
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
					return result
						? (mapEntityToBetterAuth(result, model) as unknown as T)
						: null;
				}

				const mappings = getFieldMappings(model);
				const transformedWhere = where.map((condition) => {
					const mappedField = Object.entries(mappings).find(
						([betterAuthField]) => betterAuthField === condition.field,
					)?.[1];

					if (mappedField) {
						return { ...condition, field: mappedField };
					}
					return condition;
				});

				const emailCondition = transformedWhere.find(
					(w: WhereCondition) =>
						w.field === "email" || w.field === mapFieldName("email", model),
				);
				if (emailCondition && model === "user") {
					const users = await findManyEntities(model, {
						email: emailCondition.value as string,
					});
					const user = users[0];
					return user
						? (mapEntityToBetterAuth(user, model) as unknown as T)
						: null;
				}

				const nameCondition = transformedWhere.find(
					(w: WhereCondition) => w.field === "name",
				);
				if (nameCondition && model === "user") {
					const users = await findManyEntities(model, {
						name: nameCondition.value as string,
					});
					const user = users[0];
					return user
						? (mapEntityToBetterAuth(user, model) as unknown as T)
						: null;
				}

				if (model === "account") {
					const userIdCondition = transformedWhere.find(
						(w: WhereCondition) => w.field === "userId",
					);
					const providerIdCondition = transformedWhere.find(
						(w: WhereCondition) => w.field === "providerId",
					);

					if (userIdCondition && providerIdCondition) {
						const accounts = await findManyEntities(model, {
							userId: userIdCondition.value as string,
							providerId: providerIdCondition.value as string,
						});
						const account = accounts[0];
						return account
							? (mapEntityToBetterAuth(account, model) as unknown as T)
							: null;
					}

					if (userIdCondition) {
						const accounts = await findManyEntities(model, {
							userId: userIdCondition.value as string,
						});
						const account = accounts[0];
						return account
							? (mapEntityToBetterAuth(account, model) as unknown as T)
							: null;
					}
				}

				if (model === "session") {
					const tokenCondition = transformedWhere.find(
						(w: WhereCondition) => w.field === "token",
					);
					const userIdCondition = transformedWhere.find(
						(w: WhereCondition) => w.field === "userId",
					);

					if (tokenCondition) {
						const sessions = await findManyEntities(model, {
							token: tokenCondition.value as string,
						});
						const session = sessions[0];
						return session
							? (mapEntityToBetterAuth(session, model) as unknown as T)
							: null;
					}

					if (userIdCondition) {
						const sessions = await findManyEntities(model, {
							userId: userIdCondition.value as string,
						});
						const session = sessions[0];
						return session
							? (mapEntityToBetterAuth(session, model) as unknown as T)
							: null;
					}
				}

				debugLog("Unhandled findOne conditions", {
					model,
					where,
					transformedWhere,
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
				const inMemoryFilters: Array<{
					field: string;
					operator: string;
					value: unknown;
				}> = [];

				if (where && where.length > 0) {
					for (const condition of where) {
						if (condition.operator) {
							if (condition.operator === "in") {
								query[condition.field] = condition.value;
							} else if (condition.operator === "eq" || !condition.operator) {
								query[condition.field] = condition.value;
							} else {
								inMemoryFilters.push({
									field: condition.field,
									operator: condition.operator,
									value: condition.value,
								});
							}
						} else {
							query[condition.field] = condition.value;
						}
					}
				}

				const results = await findManyEntities(model, query);

				let mappedResults = results.map(
					(result: DatabaseEntity) =>
						mapEntityToBetterAuth(result, model) as unknown as T,
				);

				if (inMemoryFilters.length > 0) {
					for (const condition of inMemoryFilters) {
						mappedResults = mappedResults.filter((item: any) => {
							const fieldValue = item[condition.field];

							switch (condition.operator) {
								case "contains":
									return (
										typeof fieldValue === "string" &&
										fieldValue.includes(condition.value as string)
									);
								case "starts_with":
									return (
										typeof fieldValue === "string" &&
										fieldValue.startsWith(condition.value as string)
									);
								case "ends_with":
									return (
										typeof fieldValue === "string" &&
										fieldValue.endsWith(condition.value as string)
									);
								default:
									return true;
							}
						});
					}
				}

				if (sortBy) {
					mappedResults.sort((a: any, b: any) => {
						const aValue = a[sortBy.field];
						const bValue = b[sortBy.field];

						if (aValue === null || aValue === undefined) return 1;
						if (bValue === null || bValue === undefined) return -1;

						let comparison = 0;
						if (aValue < bValue) {
							comparison = -1;
						} else if (aValue > bValue) {
							comparison = 1;
						}

						return sortBy.direction === "desc" ? -comparison : comparison;
					});
				}

				if (offset && offset > 0) {
					mappedResults = mappedResults.slice(offset);
				}

				if (limit && limit > 0) {
					mappedResults = mappedResults.slice(0, limit);
				}

				return mappedResults;
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

				const query: Record<string, unknown> = {};
				if (where && where.length > 0) {
					for (const condition of where) {
						// Handle operators
						if (condition.operator) {
							if (condition.operator === "eq" || condition.operator === "in") {
								query[condition.field] = condition.value;
							}
							// For other operators, we would need to implement in-memory filtering
							// but for now, we'll just use the field value directly
						} else {
							query[condition.field] = condition.value;
						}
					}
				}

				const entitiesToDelete = await findManyEntities(model, query);

				let deletedCount = 0;

				for (const entity of entitiesToDelete) {
					try {
						await deleteEntity(model, entity.id);
						deletedCount++;
					} catch (error) {
						debugLog("deleteMany error", { entity: entity.id, error });
					}
				}

				return deletedCount;
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

/**
 * Helper function to create an adapter with field mappings
 * This is useful when Better Auth is configured with custom field names
 */
export const createCustomDatabaseAdapterWithMappings = (
	db: IDatabase,
	betterAuthConfig: any,
	config: Omit<CustomDatabaseAdapterConfig, "fieldMappings"> = {},
) => {
	const fieldMappings: CustomDatabaseAdapterConfig["fieldMappings"] = {};

	if (betterAuthConfig?.user?.fields) {
		fieldMappings.user = betterAuthConfig.user.fields;
	}
	if (betterAuthConfig?.session?.fields) {
		fieldMappings.session = betterAuthConfig.session.fields;
	}
	if (betterAuthConfig?.account?.fields) {
		fieldMappings.account = betterAuthConfig.account.fields;
	}
	if (betterAuthConfig?.verification?.fields) {
		fieldMappings.verification = betterAuthConfig.verification.fields;
	}

	let generateId: () => string;

	if (betterAuthConfig?.advanced?.database?.generateId) {
		generateId = betterAuthConfig.advanced.database.generateId;
	} else {
		generateId = () => crypto.randomUUID();
	}

	return customDatabaseAdapter(db, {
		...config,
		fieldMappings,
		generateId,
	});
};

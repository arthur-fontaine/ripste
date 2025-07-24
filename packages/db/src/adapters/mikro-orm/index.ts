/// <reference types="@rspack/core/module" />

import type { EntityClass, EntityManager } from "@mikro-orm/core";

export { MikroOrmDatabase } from "./MikroOrmDatabase.ts";

export type { IDatabase } from "../../domain/ports/IDatabase.ts";

export type {
	IAccount,
	IInsertAccount,
	IUpdateAccount,
} from "../../domain/models/IAccount.ts";

export type {
	ICheckoutPage,
	IInsertCheckoutPage,
	IUpdateCheckoutPage,
	ICheckoutDisplayData,
} from "../../domain/models/ICheckoutPage.ts";

export type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
	IUpdateCheckoutTheme,
} from "../../domain/models/ICheckoutTheme.ts";

export type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
} from "../../domain/models/ICompany.ts";

export type {
	IOAuthApplication,
	IInsertOAuthApplication,
	IUpdateOAuthApplication,
} from "../../domain/models/IOAuthApplication.ts";

export type {
	IOAuthAccessToken,
	IInsertOAuthAccessToken,
	IUpdateOAuthAccessToken,
} from "../../domain/models/IOAuthAccessToken.ts";

export type {
	IOAuthConsent,
	IInsertOAuthConsent,
	IUpdateOAuthConsent,
} from "../../domain/models/IOAuthConsent.ts";

export type {
	IPaymentAttempt,
	IInsertPaymentAttempt,
	IUpdatePaymentAttempt,
} from "../../domain/models/IPaymentAttempt.ts";

export type {
	IRefund,
	IInsertRefund,
	IUpdateRefund,
} from "../../domain/models/IRefund.ts";

export type {
	ISession,
	IInsertSession,
	IUpdateSession,
} from "../../domain/models/ISession.ts";

export type {
	IStoreMember,
	IInsertStoreMember,
	IUpdateStoreMember,
} from "../../domain/models/IStoreMember.ts";

export type {
	IStore,
	IInsertStore,
	IUpdateStore,
} from "../../domain/models/IStore.ts";

export type {
	IStoreStatus,
	IInsertStoreStatus,
	IUpdateStoreStatus,
} from "../../domain/models/IStoreStatus.ts";

export type {
	IThemeCustomization,
	IInsertThemeCustomization,
	IUpdateThemeCustomization,
} from "../../domain/models/IThemeCustomization.ts";

export type {
	ITransactionEvent,
	IInsertTransactionEvent,
	IUpdateTransactionEvent,
	ITransactionEventData,
} from "../../domain/models/ITransactionEvent.ts";

export type {
	ITransaction,
	IInsertTransaction,
	IUpdateTransaction,
} from "../../domain/models/ITransaction.ts";

export type {
	IUser,
	IInsertUser,
	IUpdateUser,
} from "../../domain/models/IUser.ts";

export type {
	IUserProfile,
	IInsertUserProfile,
	IUpdateUserProfile,
} from "../../domain/models/IUserProfile.ts";

export type {
	IVerification,
	IInsertVerification,
	IUpdateVerification,
} from "../../domain/models/IVerification.ts";

export type {
	IJwks,
	IInsertJwks,
	IUpdateJwks,
} from "../../domain/models/IJwks.ts";

export const loadModels = (loadEm: () => EntityManager) => {
	const modelsContext = import.meta.webpackContext("./models", {
		recursive: false,
	});
	return modelsContext.keys().reduce(
		(acc, key) => {
			const modelName = key.replace("./", "").replace(".ts", "");
			const modelModule = modelsContext(key) as Record<
				string,
				EntityClass<unknown>
			>;
			const modelClass = Object.values(modelModule)[0];
			if (!modelClass) {
				throw new Error(`Model class not found in module: ${key}`);
			}
			modelClass.prototype._loadEm = loadEm;
			acc[modelName] = modelClass;
			return acc;
		},
		{} as Record<string, EntityClass<unknown>>,
	);
};

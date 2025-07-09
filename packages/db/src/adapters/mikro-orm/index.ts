/// <reference types="@rspack/core/module" />

import type { EntityClass } from "@mikro-orm/core";

export { MikroOrmDatabase } from "./MikroOrmDatabase.ts";

export type { IDatabase } from "../../domain/ports/IDatabase.ts";

export type {
	IAccount,
	IInsertAccount,
	IUpdateAccount,
	IAccountTable,
} from "../../domain/models/IAccount.ts";

export type {
	IApiCredential,
	IInsertApiCredential,
	IUpdateApiCredential,
	IApiCredentialTable,
} from "../../domain/models/IApiCredential.ts";

export type { IBaseModel } from "../../domain/models/IBaseModel.ts";

export type {
	ICheckoutPage,
	IInsertCheckoutPage,
	IUpdateCheckoutPage,
	ICheckoutPageTable,
	ICheckoutDisplayData,
} from "../../domain/models/ICheckoutPage.ts";

export type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
	IUpdateCheckoutTheme,
	ICheckoutThemeTable,
} from "../../domain/models/ICheckoutTheme.ts";

export type {
	ICompany,
	IInsertCompany,
	IUpdateCompany,
	ICompanyTable,
} from "../../domain/models/ICompany.ts";

export type {
	IJwtToken,
	IInsertJwtToken,
	IUpdateJwtToken,
	IJwtTokenTable,
} from "../../domain/models/IJwtToken.ts";

export type {
	IOAuth2Client,
	IInsertOAuth2Client,
	IUpdateOAuth2Client,
	IOAuth2ClientTable,
} from "../../domain/models/IOAuth2Client.ts";

export type {
	IPaymentAttempt,
	IInsertPaymentAttempt,
	IUpdatePaymentAttempt,
	IPaymentAttemptTable,
} from "../../domain/models/IPaymentAttempt.ts";

export type {
	IRefund,
	IInsertRefund,
	IUpdateRefund,
	IRefundTable,
} from "../../domain/models/IRefund.ts";

export type {
	ISession,
	IInsertSession,
	IUpdateSession,
	ISessionTable,
} from "../../domain/models/ISession.ts";

export type {
	IStoreMember,
	IInsertStoreMember,
	IUpdateStoreMember,
	IStoreMemberTable,
} from "../../domain/models/IStoreMember.ts";

export type {
	IStore,
	IInsertStore,
	IUpdateStore,
	IStoreTable,
} from "../../domain/models/IStore.ts";

export type {
	IStoreStatus,
	IInsertStoreStatus,
	IUpdateStoreStatus,
	IStoreStatusTable,
} from "../../domain/models/IStoreStatus.ts";

export type {
	IThemeCustomization,
	IInsertThemeCustomization,
	IUpdateThemeCustomization,
	IThemeCustomizationTable,
} from "../../domain/models/IThemeCustomization.ts";

export type {
	ITransactionEvent,
	IInsertTransactionEvent,
	IUpdateTransactionEvent,
	ITransactionEventTable,
	ITransactionEventData,
} from "../../domain/models/ITransactionEvent.ts";

export type {
	ITransaction,
	IInsertTransaction,
	IUpdateTransaction,
	ITransactionTable,
} from "../../domain/models/ITransaction.ts";

export type {
	IUser,
	IInsertUser,
	IUpdateUser,
	IUserTable,
} from "../../domain/models/IUser.ts";

export type {
	IUserProfile,
	IInsertUserProfile,
	IUpdateUserProfile,
	IUserProfileTable,
} from "../../domain/models/IUserProfile.ts";

export type {
	IVerification,
	IInsertVerification,
	IUpdateVerification,
	IVerificationTable,
} from "../../domain/models/IVerification.ts";

export const loadModels = () => {
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
			acc[modelName] = modelClass;
			return acc;
		},
		{} as Record<string, EntityClass<unknown>>,
	);
};

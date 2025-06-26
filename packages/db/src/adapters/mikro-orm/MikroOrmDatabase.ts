import type { EntityManager } from "@mikro-orm/core";
import type { IDatabase } from "../../domain/ports/IDatabase.ts";
import type { IApiCredentialRepository } from "../../domain/ports/repositories/IApiCredentialRepository.ts";
import type { ICheckoutPageRepository } from "../../domain/ports/repositories/ICheckoutPageRepository.ts";
import type { ICheckoutThemeRepository } from "../../domain/ports/repositories/ICheckoutThemeRepository.ts";
import type { ICompanyRepository } from "../../domain/ports/repositories/ICompanyRepository.ts";
import type { IJwtTokenRepository } from "../../domain/ports/repositories/IJwtTokenRepository.ts";
import type { IOAuth2ClientRepository } from "../../domain/ports/repositories/IOAuth2ClientRepository.ts";
import type { IPaymentAttemptRepository } from "../../domain/ports/repositories/IPaymentAttemptRepository.ts";
import type { IRefundRepository } from "../../domain/ports/repositories/IRefundRepository.ts";
import type { IStoreMemberRepository } from "../../domain/ports/repositories/IStoreMemberRepository.ts";
import type { IStoreRepository } from "../../domain/ports/repositories/IStoreRepository.ts";
import type { IStoreStatusRepository } from "../../domain/ports/repositories/IStoreStatusRepository.ts";
import type { IThemeCustomizationRepository } from "../../domain/ports/repositories/IThemeCustomizationRepository.ts";
import type { ITransactionEventRepository } from "../../domain/ports/repositories/ITransactionEventRepository.ts";
import type { ITransactionRepository } from "../../domain/ports/repositories/ITransactionRepository.ts";
import type { IUserProfileRepository } from "../../domain/ports/repositories/IUserProfileRepository.ts";
import type { IUserRepository } from "../../domain/ports/repositories/IUserRepository.ts";
import { MikroOrmApiCredentialRepository } from "./repositories/MikroOrmApiCredentialRepository.ts";
import { MikroOrmCheckoutPageRepository } from "./repositories/MikroOrmCheckoutPageRepository.ts";
import { MikroOrmCheckoutThemeRepository } from "./repositories/MikroOrmCheckoutThemeRepository.ts";
import { MikroOrmCompanyRepository } from "./repositories/MikroOrmCompanyRepository.ts";
import { MikroOrmJwtTokenRepository } from "./repositories/MikroOrmJwtTokenRepository.ts";
import { MikroOrmPaymentAttemptRepository } from "./repositories/MikroOrmPaymentAttemptRepository.ts";
import { MikroOrmRefundRepository } from "./repositories/MikroOrmRefundRepository.ts";
import { MikroOrmStoreMemberRepository } from "./repositories/MikroOrmStoreMemberRepository.ts";
import { MikroOrmStoreRepository } from "./repositories/MikroOrmStoreRepository.ts";
import { MikroOrmStoreStatusRepository } from "./repositories/MikroOrmStoreStatusRepository.ts";
import { MikroOrmThemeCustomizationRepository } from "./repositories/MikroOrmThemeCustomizationRepository.ts";
import { MikroOrmTransactionEventRepository } from "./repositories/MikroOrmTransactionEventRepository.ts";
import { MikroOrmTransactionRepository } from "./repositories/MikroOrmTransactionRepository.ts";
import { MikroOrmUserProfileRepository } from "./repositories/MikroOrmUserProfileRepository.ts";
import { MikroOrmOauth2ClientRepository } from "./repositories/MikroOrmOauth2ClientRepository.ts";
import { MikroOrmUserRepository } from "./repositories/MikroOrmUserRepository.ts";

export class MikroOrmDatabase implements IDatabase {
	constructor(em: EntityManager) {
		const params = { em };

		this.apiCredential = new MikroOrmApiCredentialRepository(params);
		this.checkoutPage = new MikroOrmCheckoutPageRepository(params);
		this.checkoutTheme = new MikroOrmCheckoutThemeRepository(params);
		this.company = new MikroOrmCompanyRepository(params);
		this.jwtToken = new MikroOrmJwtTokenRepository(params);
		this.oauth2Client = new MikroOrmOauth2ClientRepository(params);
		this.paymentAttempt = new MikroOrmPaymentAttemptRepository(params);
		this.refund = new MikroOrmRefundRepository(params);
		this.storeMember = new MikroOrmStoreMemberRepository(params);
		this.store = new MikroOrmStoreRepository(params);
		this.storeStatus = new MikroOrmStoreStatusRepository(params);
		this.themeCustomization = new MikroOrmThemeCustomizationRepository(params);
		this.transactionEvent = new MikroOrmTransactionEventRepository(params);
		this.transaction = new MikroOrmTransactionRepository(params);
		this.userProfile = new MikroOrmUserProfileRepository(params);
		this.user = new MikroOrmUserRepository(params);
	}

	apiCredential: IApiCredentialRepository;
	checkoutPage: ICheckoutPageRepository;
	checkoutTheme: ICheckoutThemeRepository;
	company: ICompanyRepository;
	jwtToken: IJwtTokenRepository;
	oauth2Client: IOAuth2ClientRepository;
	paymentAttempt: IPaymentAttemptRepository;
	refund: IRefundRepository;
	storeMember: IStoreMemberRepository;
	store: IStoreRepository;
	storeStatus: IStoreStatusRepository;
	themeCustomization: IThemeCustomizationRepository;
	transactionEvent: ITransactionEventRepository;
	transaction: ITransactionRepository;
	userProfile: IUserProfileRepository;
	user: IUserRepository;
}

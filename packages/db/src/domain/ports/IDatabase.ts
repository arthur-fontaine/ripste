import type { IApiCredentialRepository } from "./repositories/IApiCredentialRepository.ts";
import type { ICheckoutPageRepository } from "./repositories/ICheckoutPageRepository.ts";
import type { ICheckoutThemeRepository } from "./repositories/ICheckoutThemeRepository.ts";
import type { ICompanyRepository } from "./repositories/ICompanyRepository.ts";
import type { IJwtTokenRepository } from "./repositories/IJwtTokenRepository.ts";
import type { IOAuth2ClientRepository } from "./repositories/IOAuth2ClientRepository.ts";
import type { IPaymentAttemptRepository } from "./repositories/IPaymentAttemptRepository.ts";
import type { IPaymentMethodRepository } from "./repositories/IPaymentMethodRepository.ts";
import type { IRefundRepository } from "./repositories/IRefundRepository.ts";
import type { IStoreMemberRepository } from "./repositories/IStoreMemberRepository.ts";
import type { IStoreRepository } from "./repositories/IStoreRepository.ts";
import type { IStoreStatusRepository } from "./repositories/IStoreStatusRepository.ts";
import type { IThemeCustomizationRepository } from "./repositories/IThemeCustomizationRepository.ts";
import type { ITransactionEventRepository } from "./repositories/ITransactionEventRepository.ts";
import type { ITransactionRepository } from "./repositories/ITransactionRepository.ts";
import type { IUserProfileRepository } from "./repositories/IUserProfileRepository.ts";
import type { IUserRepository } from "./repositories/IUserRepository.ts";

export interface IDatabase {
	apiCredential: IApiCredentialRepository;
	checkoutPage: ICheckoutPageRepository;
	checkoutTheme: ICheckoutThemeRepository;
	company: ICompanyRepository;
	jwtToken: IJwtTokenRepository;
	oauth2Client: IOAuth2ClientRepository;
	paymentAttempt: IPaymentAttemptRepository;
	paymentMethod: IPaymentMethodRepository;
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

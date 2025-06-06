export interface IUser {
	id: string;
	email: string;
	passwordHash: string;
	emailVerified: boolean;
	permissionLevel: "admin" | "user";
	createdAt: Date;
	updatedAt: Date | null;
	deletedAt: Date | null;

	profile?: IUserProfile;
	storeMembers?: IStoreMember[];
	createdCredentials?: IApiCredential[];
	initiatedRefunds?: IRefund[];

	getProfile(): Promise<IUserProfile | null>;
	getStores(): Promise<IStore[]>;
	canAccessStore(storeId: string): Promise<boolean>;
}

export interface IUserProfile {
	id: string;
	userId: string;
	firstName: string | null;
	lastName: string | null;
	phone: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	user?: IUser;

	getFullName(): string | null;
}

export interface ICompany {
	id: string;
	legalName: string;
	tradeName: string | null;
	kbis: string;
	vatNumber: string | null;
	address: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	stores?: IStore[];

	getStores(): Promise<IStore[]>;
	getActiveStores(): Promise<IStore[]>;
}

export interface IStore {
	id: string;
	companyId: string;
	name: string;
	slug: string;
	contactEmail: string;
	contactPhone: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	company?: ICompany;
	storeMembers?: IStoreMember[];
	storeStatuses?: IStoreStatus[];
	apiCredentials?: IApiCredential[];
	checkoutThemes?: ICheckoutTheme[];
	transactions?: ITransaction[];

	getCurrentStatus(): Promise<IStoreStatus | null>;
	isActive(): Promise<boolean>;
	getMembers(): Promise<IStoreMember[]>;
	getOwners(): Promise<IStoreMember[]>;
}

export interface IStoreStatus {
	id: string;
	storeId: string;
	status: "pending" | "active" | "suspended" | "refused";
	reason: string | null;
	changedBy: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	store?: IStore;
	changedByUser?: IUser;
}

export interface IStoreMember {
	id: string;
	userId: string;
	storeId: string;
	permissionLevel: "owner";
	createdAt: Date;
	updatedAt: Date | null;

	user?: IUser;
	store?: IStore;

	isOwner(): boolean;
}

export interface IApiCredential {
	id: string;
	storeId: string;
	name: string;
	credentialType: "jwt" | "oauth2";
	isActive: boolean;
	createdBy: string;
	createdAt: Date;
	expiresAt: Date | null;
	lastUsedAt: Date | null;

	store?: IStore;
	createdByUser?: IUser;
	jwtToken?: IJwtToken;
	oauth2Client?: IOAuth2Client;
	transactions?: ITransaction[];

	isExpired(): boolean;
	updateLastUsed(): Promise<void>;
	deactivate(): Promise<void>;
}

export interface IJwtToken {
	id: string;
	credentialId: string;
	tokenHash: string;
	permissions: string[];

	credential?: IApiCredential;

	hasPermission(permission: string): boolean;
	verifyToken(token: string): boolean;
}

export interface IOAuth2Client {
	id: string;
	credentialId: string;
	clientId: string;
	clientSecretHash: string;
	redirectUris: string[];
	scopes: string[];

	credential?: IApiCredential;

	isValidRedirectUri(uri: string): boolean;
	hasScope(scope: string): boolean;
	verifyClientSecret(secret: string): boolean;
}

export interface ICheckoutTheme {
	id: string;
	storeId: string;
	name: string;
	version: number;
	createdAt: Date;
	updatedAt: Date | null;

	store?: IStore;
	customizations?: IThemeCustomization[];
	checkoutPages?: ICheckoutPage[];

	getCustomizations(): Promise<IThemeCustomization[]>;
	getCssCustomization(): Promise<IThemeCustomization | null>;
}

export interface IThemeCustomization {
	id: string;
	themeId: string;
	customizationType: "css";
	content: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	theme?: ICheckoutTheme;
}

export interface ITransaction {
	id: string;
	storeId: string;
	reference: string;
	amount: number;
	currency: string;
	status: "created" | "processing" | "completed" | "failed" | "cancelled";
	metadata: Record<string, string> | null;
	apiCredentialId: string | null;
	createdAt: Date;
	updatedAt: Date | null;

	store?: IStore;
	apiCredential?: IApiCredential;
	transactionEvents?: ITransactionEvent[];
	paymentMethods?: IPaymentMethod[];
	checkoutPages?: ICheckoutPage[];
	paymentAttempts?: IPaymentAttempt[];
	refunds?: IRefund[];

	addEvent(
		eventType: string,
		eventData: TransactionEventData,
	): Promise<ITransactionEvent>;
	updateStatus(status: ITransaction["status"], reason?: string): Promise<void>;
	getTotalRefunded(): Promise<number>;
	canBeRefunded(): Promise<boolean>;
	getLastAttempt(): Promise<IPaymentAttempt | null>;
}

export interface ITransactionEvent {
	id: string;
	transactionId: string;
	eventType: string;
	eventData: TransactionEventData | null;
	occurredAt: Date;

	transaction?: ITransaction;
}

export interface IPaymentMethod {
	id: string;
	transactionId: string;
	methodType: "checkout_page" | "api_direct" | "link" | "qr_code";
	methodData: Record<string, string> | null;
	createdAt: Date;

	transaction?: ITransaction;
	paymentAttempts?: IPaymentAttempt[];

	getAttempts(): Promise<IPaymentAttempt[]>;
	getSuccessfulAttempt(): Promise<IPaymentAttempt | null>;
}

export interface ICheckoutPage {
	id: string;
	transactionId: string;
	themeId: string | null;
	uri: string;
	redirectSuccessUrl: string;
	redirectCancelUrl: string | null;
	displayData: CheckoutDisplayData | null;
	expiresAt: Date | null;
	createdAt: Date;
	accessedAt: Date | null;
	completedAt: Date | null;

	transaction?: ITransaction;
	theme?: ICheckoutTheme;

	isExpired(): boolean;
	isAccessed(): boolean;
	isCompleted(): boolean;
	markAsAccessed(): Promise<void>;
	markAsCompleted(): Promise<void>;
}

export interface IPaymentAttempt {
	id: string;
	transactionId: string;
	paymentMethodId: string;
	status: "pending" | "success" | "failed";
	failureReason: string | null;
	customerIp: string | null;
	customerData: Record<string, string> | null;
	attemptedAt: Date;

	transaction?: ITransaction;
	paymentMethod?: IPaymentMethod;

	isSuccessful(): boolean;
	isFailed(): boolean;
	isPending(): boolean;
}

export interface IRefund {
	id: string;
	transactionId: string;
	amount: number;
	reason: string | null;
	status: "pending" | "processing" | "completed" | "failed";
	initiatedBy: string | null;
	createdAt: Date;
	processedAt: Date | null;

	transaction?: ITransaction;
	initiatedByUser?: IUser;

	isCompleted(): boolean;
	canBeProcessed(): boolean;
	markAsProcessed(): Promise<void>;
}

export interface CheckoutDisplayData {
	title: string;
	description?: string;

	logo: {
		url: string;
		alt: string | null;
		width: number | null;
		height: number | null;
	} | null;

	colors: {
		primary: string | null;
		secondary: string | null;
		background: string | null;
		text: string | null;
		success: string | null;
		error: string | null;
	} | null;

	items: Array<{
		name: string;
		description: string | null;
		quantity: number;
		unitPrice: number;
		imageUrl: string | null;
	} | null>;

	contact: {
		supportEmail: string | null;
		supportPhone: string | null;
		website: string | null;
	} | null;

	settings: {
		showItems: boolean;
		showTotal: boolean;
		showCurrency: boolean;
		language: "fr" | "en" | "es" | "de";
		showPoweredBy: boolean;
	} | null;

	customTexts: {
		payButton: string | null;
		cancelButton: string | null;
		processingMessage: string | null;
		successMessage: string | null;
		errorMessage: string | null;
	} | null;
}

export type TransactionEventData =
	| TransactionCreatedEvent
	| TransactionProcessingEvent
	| TransactionCompletedEvent
	| TransactionFailedEvent
	| TransactionCancelledEvent
	| PaymentAttemptEvent
	| RefundEvent;

export interface TransactionCreatedEvent {
	type: "transaction_created";
	amount: number;
	currency: string;
	reference: string;
	storeId: string;
}

export interface TransactionProcessingEvent {
	type: "transaction_processing";
	paymentMethodId: string;
	processingStartedAt: string;
}

export interface TransactionCompletedEvent {
	type: "transaction_completed";
	paymentMethodId: string;
	completedAt: string;
	paymentProcessorResponse?: {
		transactionId: string;
		status: string;
		authCode?: string;
	};
}

export interface TransactionFailedEvent {
	type: "transaction_failed";
	reason: string;
	paymentMethodId?: string;
	errorCode?: string;
	failedAt: string;
}

export interface TransactionCancelledEvent {
	type: "transaction_cancelled";
	reason: string;
	cancelledBy: "customer" | "merchant" | "system";
	cancelledAt: string;
}

export interface PaymentAttemptEvent {
	type: "payment_attempt";
	paymentMethodId: string;
	status: "started" | "completed" | "failed";
	attemptNumber: number;
	customerIp?: string;
}

export interface RefundEvent {
	type: "refund_initiated" | "refund_completed" | "refund_failed";
	refundId: string;
	amount: number;
	reason?: string;
}

export interface IUserRepository {
	findById(id: string): Promise<IUser | null>;
	findByEmail(email: string): Promise<IUser | null>;
	create(userData: Partial<IUser>): Promise<IUser>;
	update(id: string, userData: Partial<IUser>): Promise<IUser>;
	delete(id: string): Promise<void>;
	softDelete(id: string): Promise<void>;
}

export interface IStoreRepository {
	findById(id: string): Promise<IStore | null>;
	findBySlug(slug: string): Promise<IStore | null>;
	findByCompanyId(companyId: string): Promise<IStore[]>;
	create(storeData: Partial<IStore>): Promise<IStore>;
	update(id: string, storeData: Partial<IStore>): Promise<IStore>;
	delete(id: string): Promise<void>;
}

export interface ITransactionRepository {
	findById(id: string): Promise<ITransaction | null>;
	findByReference(reference: string): Promise<ITransaction | null>;
	findByStoreId(
		storeId: string,
		options?: { limit?: number; offset?: number },
	): Promise<ITransaction[]>;
	create(transactionData: Partial<ITransaction>): Promise<ITransaction>;
	update(
		id: string,
		transactionData: Partial<ITransaction>,
	): Promise<ITransaction>;
	delete(id: string): Promise<void>;
}

export interface IDatabase {
	connect(): Promise<void>;
	disconnect(): Promise<void>;
	sync(options?: { force?: boolean; alter?: boolean }): Promise<void>;
	transaction<T>(callback: () => Promise<T>): Promise<T>;
}

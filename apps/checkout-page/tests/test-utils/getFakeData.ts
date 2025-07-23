import { randomUUID } from "node:crypto";
import { database } from "../../src/database.ts";

export async function getFakeData() {
	const user = await createUser();
	const session = await createSession(user);
	const store = await createStore(user);
	const theme = await createTheme(store);
	const transaction = await createTransaction(store, session);
	const checkoutPage = await createCheckoutPage(transaction, theme);

	return { user, store, theme, transaction, checkoutPage };
}

async function createUser() {
	const user = await database.user.insert({
		email: "fndknfkds@gmail.com",
		emailVerified: true,
		passwordHash: "hashed_password",
		permissionLevel: "user",
		profileId: null,
	});

	return user;
}

async function createStore(user: Awaited<ReturnType<typeof createUser>>) {
	const store = await database.store.insert({
		name: "Test Store",
		slug: "test-store",
		contactEmail: "test@example.com",
		companyId: null,
		contactPhone: null,
	});

	await database.storeMember.insert({
		storeId: store.id,
		userId: user.id,
		permissionLevel: "owner",
	});

	return store;
}

async function createTheme(store: Awaited<ReturnType<typeof createStore>>) {
	const theme = await database.checkoutTheme.insert({
		name: "Default Theme",
		storeId: store.id,
		version: 1,
	});

	return theme;
}

async function createSession(user: Awaited<ReturnType<typeof createUser>>) {
	const session = await database.session.insert({
		userId: user.id,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60),
		token: randomUUID(),
	});

	return session;
}

async function createTransaction(
	store: Awaited<ReturnType<typeof createStore>>,
	session: Awaited<ReturnType<typeof createSession>>,
) {
	const transaction = await database.transaction.insert({
		amount: 1000,
		currency: "USD",
		reference: "test-transaction",
		status: "created",
		methodType: "checkout_page",
		metadata: null,
		storeId: store.id,
		sessionId: session.id,
	});

	await database.transactionEvent.insert({
		transactionId: transaction.id,
		eventData: { type: "transaction_created" },
	});

	return transaction;
}

async function createCheckoutPage(
	transaction: Awaited<ReturnType<typeof createTransaction>>,
	theme: Awaited<ReturnType<typeof createTheme>>,
) {
	const checkoutPage = await database.checkoutPage.insert({
		accessedAt: null,
		completedAt: null,
		displayData: {
			title: "Checkout Page",
			description: "This is a test checkout page.",
			logo: {
				url: "https://example.com/logo.png",
				alt: "Test Logo",
				height: 100,
				width: 100,
			},
			colors: null,
			contact: {
				supportEmail: "support@example.com",
				supportPhone: "123-456-7890",
				website: "https://example.com",
			},
			customTexts: null,
			items: [],
			settings: null,
		},
		expiresAt: null,
		redirectCancelUrl: null,
		redirectSuccessUrl: null,
		themeId: theme.id,
		transactionId: transaction.id,
		uri: randomUUID(),
	});

	return checkoutPage;
}

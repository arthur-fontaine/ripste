import { getApiClient } from "./get-api-client.ts";

export async function getRealConditionApiClient() {
	const user = await createUser();
	const store = await createStore(user);
	const theme = await createTheme(store);

	const cookie = await getLoginCookie();

	const { apiClient, setDatabase, getDatabase, database } = await getApiClient({
		cookie,
	});

	return {
		apiClient,
		setDatabase,
		getDatabase,
		database,
		data: { user, store, theme },
	};
}

async function createUser() {
	const { app, database } = await getApiClient();

	await app.fetch(
		new Request("https://_/auth/sign-up/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: "NFKJDNSK",
				email: "fndknfkds@gmail.com",
				password: "fneksdKNKNKdsmks.329",
			}),
		}),
	);
	const [user] = await database.user.findMany({ email: "fndknfkds@gmail.com" });

	if (!user) throw new Error("User not found");

	await database.user.update(user.id, { emailVerified: true });

	return user;
}

async function createStore(user: Awaited<ReturnType<typeof createUser>>) {
	const { database } = await getApiClient();

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
	const { database } = await getApiClient();

	const theme = await database.checkoutTheme.insert({
		name: "Default Theme",
		storeId: store.id,
		version: 1,
	});

	return theme;
}

async function getLoginCookie() {
	const { app } = await getApiClient();

	const signInResponse = await app.fetch(
		new Request("https://_/auth/sign-in/email", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email: "fndknfkds@gmail.com",
				password: "fneksdKNKNKdsmks.329",
			}),
		}),
	);

	const cookie = signInResponse.headers.get("set-cookie");
	if (!cookie) throw new Error("Missing cookie");

	return cookie;
}

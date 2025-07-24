import { Hono } from "hono";
import { cors } from "hono/cors";
import { apiClient } from "./api.ts";

const app = new Hono();

app.use(
	"*",
	cors({
		origin: "http://localhost:5180",
		allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

const CHECKOUT_URL = process.env["CHECKOUT_URL"] || "http://localhost:3002";

app.post("/checkout-panier", async (c) => {
	try {
		const panier = (await c.req.json()) as {
			items: {
				name: string;
				productId: string;
				quantity: number;
				size?: string;
				color?: string;
				price: number;
			}[];
			total: number;
		};

		const themesRes = await apiClient.stores.themes.$get();

		const [theme] = await themesRes.json();

		if (!theme) {
			return c.json({ error: "Aucun thème trouvé pour le store" }, 404);
		}

		const transactionResponse = await apiClient.payments.transactions.$post({
			json: {
				amount: panier.total,
				currency: "EUR",
				reference: `order-${Date.now()}`,
				metadata: {
					source: "ecommerce-demo",
					items: JSON.stringify(panier.items),
				},
				checkoutPage: {
					title: "Paiement E-commerce Demo",
					themeId: theme.id,
					description: "Finalisation de votre commande",
					items: panier.items.map((item) => ({
						name: item.name,
						description: null,
						quantity: item.quantity,
						unitPrice: item.price,
						imageUrl: null,
					})),
					settings: {
						showItems: true,
						showTotal: true,
						showCurrency: true,
						language: "fr",
						showPoweredBy: true,
					},
				},
			},
		});

		if (!transactionResponse.ok) {
			const error = await transactionResponse.json();
			throw new Error(`Erreur API Ripste: ${JSON.stringify(error)}`);
		}

		const transactionData = await transactionResponse.json();

		const checkoutUri = transactionData.data.uri;
		const redirectUrl = `${CHECKOUT_URL}/${checkoutUri}`;

		return c.redirect(redirectUrl, 303);
	} catch (error) {
		console.error("Erreur lors de la création du paiement:", error);
		return c.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Erreur inconnue",
			},
			500,
		);
	}
});

app.get("/ping", (c) => {
	return c.json({ message: "Backend e-commerce opérationnel!" });
});

export { app };

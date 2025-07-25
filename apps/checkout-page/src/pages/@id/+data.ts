import fs from "node:fs";
import type { PageContextServer } from "vike/types";
import { database } from "../../database.ts";
import { render } from "vike/abort";
import type {
	ICheckoutDisplayData,
	ICheckoutTheme,
} from "@ripste/db/mikro-orm";

export type Data = {
	id: string;
	amount: number;
	currency: string;
	displayData: ICheckoutDisplayData;
	theme: ICheckoutTheme;
	style: string;
	uri: string;
};

export default async function data(
	pageContext: PageContextServer,
): Promise<Data> {
	const uri = pageContext.routeParams["id"];
	if (!uri) throw render(404, "Checkout page not found");

	const [checkoutPage] = await database.checkoutPage.findMany({ uri });
	if (!checkoutPage) throw render(404, "Checkout page not found");

	const now = new Date();
	const isExpired = checkoutPage.expiresAt && checkoutPage.expiresAt < now;
	if (isExpired) throw render(404, "Checkout page not found");

	const isCompleted = checkoutPage.completedAt !== null;
	const isRenderingSuccess = pageContext.urlPathname.endsWith("/success");
	const isRenderingError = pageContext.urlPathname.endsWith("/error");
	if (isCompleted && !isRenderingSuccess && !isRenderingError)
		throw render(404, "Checkout page not found");

	const data: Data = {
		id: checkoutPage.id,
		amount: checkoutPage.transaction.amount,
		currency: checkoutPage.transaction.currency,
		displayData: checkoutPage.displayData,
		theme: checkoutPage.theme,
		uri: checkoutPage.uri,
		style: "",
	};
	data.style = getStyle(data);

	return data;
}

function getStyle(data: Data): string {
	let css = "";
	if (data.displayData.colors) {
		const vars = Object.entries(data.displayData.colors)
			.filter(([_, v]) => v)
			.map(([k, v]) => `--${k}: ${v};`)
			.join(" ");
		if (vars) css += `:root { ${vars} } `;
	}
	for (const c of data.theme.customizations) {
		if (c.content) css += c.content;
	}

	if (css.trim() === "") {
		return fs.readFileSync(new URL("./default.css", import.meta.url), "utf-8");
	}

	return css;
}

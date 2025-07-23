import type { PageContextServer } from "vike/types";
import { database } from "../../database.ts";
import { render } from "vike/abort";

export type Data = {
  id: string;
  amount: number;
  currency: string;
};

export default async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams["id"];
  if (!id) throw render(404, "Checkout page not found");
  const [checkoutPage] = await database.checkoutPage.findMany({ uri: id })

  if (!checkoutPage) {
    throw render(404, "Checkout page not found");
  }

  const transaction = await database.transaction.findOne(checkoutPage.transaction.id);
  if (!transaction) {
    throw render(404, "Transaction not found");
  }

  return {
    id: checkoutPage.id,
    amount: transaction.amount,
    currency: transaction.currency,
  };
}

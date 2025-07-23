import type { PageContextServer } from "vike/types";
import { database } from "../../database.ts";
import { render } from "vike/abort";

export type Data = {
  id: string;
};

export default async function data(pageContext: PageContextServer): Promise<Data> {
  const id = pageContext.routeParams["id"];
  if (!id) throw render(404, "Checkout page not found");
  const [checkoutPage] = await database.checkoutPage.findMany({ uri: id })

  if (!checkoutPage) {
    throw render(404, "Checkout page not found");
  }

  return {
    id: checkoutPage.id,
  };
}

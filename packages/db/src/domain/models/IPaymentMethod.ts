import type { Insertable } from "../../types/insertable.ts";
import type { IPaymentAttempt } from "./IPaymentAttempt.ts";
import type { ITransaction } from "./ITransaction.ts";

export interface IPaymentMethod {
	id: string;
	methodType: "checkout_page" | "api_direct" | "link" | "qr_code";
	methodData: Record<string, string> | null;
	createdAt: Date;

	transaction: ITransaction | null;
	paymentAttempts: IPaymentAttempt[] | null;
}

export type IInsertPaymentMethod = Insertable<
	IPaymentMethod,
	"transaction" | "paymentAttempts"
> & {
	transactionId?: ITransaction["id"] | null;
};

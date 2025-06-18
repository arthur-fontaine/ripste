import type { Insertable } from "../../types/insertable.ts";
import type { IPaymentAttempt } from "./IPaymentAttempt.ts";
import type { ITransaction } from "./ITransaction.ts";

export interface IPaymentMethod {
	id: string;
	methodType: "checkout_page";
	methodData: Record<string, string> | null;
	createdAt: Date;
	deletedAt: Date | null;

	transaction: ITransaction;
	paymentAttempts: IPaymentAttempt[];
}

export type IInsertPaymentMethod = Insertable<
	IPaymentMethod,
	"transaction" | "paymentAttempts"
> & {
	transactionId: ITransaction["id"];
};

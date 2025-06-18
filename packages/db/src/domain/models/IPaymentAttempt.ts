import type { Insertable } from "../../types/insertable.ts";
import type { IPaymentMethod } from "./IPaymentMethod.ts";
import type { ITransaction } from "./ITransaction.ts";

export interface IPaymentAttempt {
	id: string;
	status: "pending" | "success" | "failed";
	failureReason: string | null;
	customerIp: string | null;
	customerData: Record<string, string> | null;
	attemptedAt: Date;
	deletedAt: Date | null;

	transaction: ITransaction;
	paymentMethod: IPaymentMethod;
}

export type IInsertPaymentAttempt = Insertable<
	IPaymentAttempt,
	"transaction" | "paymentMethod"
> & {
	transactionId: ITransaction["id"];
	paymentMethodId: IPaymentMethod["id"];
	customerData: Record<string, string> | null;
};

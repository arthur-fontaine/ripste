import type { Insertable } from "../../types/insertable.ts";
import type { ITransaction } from "./ITransaction.ts";
import type { IUser } from "./IUser.ts";

export interface IRefund {
	id: string;
	amount: number;
	reason: string | null;
	status: "pending" | "processing" | "completed" | "failed";
	createdAt: Date;
	processedAt: Date | null;

	transaction: ITransaction | null;
	initiatedByUser: IUser | null;
}

export type IInsertRefund = Insertable<
	IRefund,
	"transaction" | "initiatedByUser"
> & {
	transactionId: ITransaction["id"] | null;
	initiatedByUserId: IUser["id"] | null;
};

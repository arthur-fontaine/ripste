import { Entity, Property, t, Enum, ManyToOne } from "@mikro-orm/core";
import type { IRefund } from "../../../domain/models/IRefund.ts";
import { BaseModel } from "./BaseModel.ts";
import { TransactionModel } from "./TransactionModel.ts";
import { UserModel } from "./UserModel.ts";

const RefundStatus = {
	PENDING: "pending",
	PROCESSING: "processing",
	COMPLETED: "completed",
	FAILED: "failed",
} as const;

@Entity()
export class RefundModel extends BaseModel implements IRefund {
	@Property({ type: t.integer })
	amount: number;

	@Property({ type: t.string, nullable: true })
	reason: string | null;

	@Enum(() => RefundStatus)
	status: "pending" | "processing" | "completed" | "failed";

	@Property({ type: t.datetime, nullable: true })
	processedAt: Date | null;

	@ManyToOne(() => TransactionModel, { nullable: true })
	transaction: TransactionModel | null;

	@ManyToOne(() => UserModel, { nullable: true })
	initiatedByUser: UserModel | null;

	constructor({
		amount,
		reason,
		status = RefundStatus.PENDING,
		processedAt,
		transaction,
		initiatedByUser,
	}: Pick<RefundModel, "amount"> &
		Partial<
			Pick<
				RefundModel,
				"reason" | "status" | "processedAt" | "transaction" | "initiatedByUser"
			>
		>) {
		super();
		this.amount = amount;
		this.reason = reason ?? null;
		this.status = status;
		this.processedAt = processedAt ?? null;
		this.transaction = transaction ?? null;
		this.initiatedByUser = initiatedByUser ?? null;
	}
}

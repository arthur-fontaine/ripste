import { Entity, Property, t, Enum, ManyToOne } from "@mikro-orm/core";
import type { IPaymentAttempt } from "../../../domain/models/IPaymentAttempt.ts";
import { BaseModel } from "./BaseModel.ts";
import { TransactionModel } from "./TransactionModel.ts";
import { PaymentMethodModel } from "./PaymentMethodModel.ts";

const PaymentAttemptStatus = {
	PENDING: "pending",
	SUCCESS: "success",
	FAILED: "failed",
} as const;

@Entity()
export class PaymentAttemptModel extends BaseModel implements IPaymentAttempt {
	@Enum(() => PaymentAttemptStatus)
	status: "pending" | "success" | "failed";

	@Property({ type: t.string, nullable: true })
	failureReason: string | null;

	@Property({ type: t.string, nullable: true })
	customerIp: string | null;

	@Property({ type: t.json, nullable: true })
	customerData: Record<string, string> | null;

	@Property()
	attemptedAt: Date;

	@ManyToOne(() => TransactionModel, { nullable: true })
	transaction: TransactionModel | null;

	@ManyToOne(() => PaymentMethodModel, { nullable: true })
	paymentMethod: PaymentMethodModel | null;

	constructor({
		status,
		failureReason,
		customerIp,
		customerData,
		attemptedAt = new Date(),
		transaction,
		paymentMethod,
	}: Pick<PaymentAttemptModel, "status"> &
		Partial<
			Pick<
				PaymentAttemptModel,
				| "failureReason"
				| "customerIp"
				| "customerData"
				| "attemptedAt"
				| "transaction"
				| "paymentMethod"
			>
		>) {
		super();
		this.status = status;
		this.failureReason = failureReason ?? null;
		this.customerIp = customerIp ?? null;
		this.customerData = customerData ?? null;
		this.attemptedAt = attemptedAt;
		this.transaction = transaction ?? null;
		this.paymentMethod = paymentMethod ?? null;
	}
}

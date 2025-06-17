import type {
	IInsertPaymentAttempt,
	IPaymentAttempt,
} from "../models/IPaymentAttempt.ts";

export interface IPaymentAttemptRepository {
	findById(id: string): Promise<IPaymentAttempt | null>;
	findMany(params: {
		transactionId?: string;
		paymentMethodId?: string;
		status?: IPaymentAttempt["status"];
		customerIp?: string;
	}): Promise<IPaymentAttempt[]>;
	create(attemptData: IInsertPaymentAttempt): Promise<IPaymentAttempt>;
	update(
		id: string,
		attemptData: IInsertPaymentAttempt,
	): Promise<IPaymentAttempt>;
	delete(id: string): Promise<void>;
}

import type {
	IInsertPaymentAttempt,
	IPaymentAttempt,
} from "../models/IPaymentAttempt.ts";

export interface IPaymentAttemptRepository {
	findById(id: string): Promise<IPaymentAttempt | null>;
	findByTransactionId(transactionId: string): Promise<IPaymentAttempt[]>;
	findByPaymentMethodId(paymentMethodId: string): Promise<IPaymentAttempt[]>;
	findByTransactionAndMethod(
		transactionId: string,
		paymentMethodId: string,
	): Promise<IPaymentAttempt[]>;
	findByStatus(status: IPaymentAttempt["status"]): Promise<IPaymentAttempt[]>;
	findByCustomerIp(customerIp: string): Promise<IPaymentAttempt[]>;
	create(attemptData: IInsertPaymentAttempt): Promise<IPaymentAttempt>;
	update(
		id: string,
		attemptData: IInsertPaymentAttempt,
	): Promise<IPaymentAttempt>;
	delete(id: string): Promise<void>;
}

import type {
	IInsertPaymentMethod,
	IPaymentMethod,
} from "../models/IPaymentMethod.ts";

export interface IPaymentMethodRepository {
	findById(id: string): Promise<IPaymentMethod | null>;
	findByTransactionId(transactionId: string): Promise<IPaymentMethod[]>;
	findByMethodType(
		methodType: IPaymentMethod["methodType"],
	): Promise<IPaymentMethod[]>;
	findByTransactionAndType(
		transactionId: string,
		methodType: IPaymentMethod["methodType"],
	): Promise<IPaymentMethod | null>;
	create(methodData: IInsertPaymentMethod): Promise<IPaymentMethod>;
	update(id: string, methodData: IInsertPaymentMethod): Promise<IPaymentMethod>;
	delete(id: string): Promise<void>;
	deleteByTransactionId(transactionId: string): Promise<void>;
}

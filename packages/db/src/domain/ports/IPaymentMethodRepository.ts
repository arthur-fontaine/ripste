// This file will be removed in RIP-27
import type {
	IInsertPaymentMethod,
	IPaymentMethod,
} from "../models/IPaymentMethod.ts";

export interface IPaymentMethodRepository {
	findById(id: string): Promise<IPaymentMethod | null>;
	findMany(params: {
		transactionId?: string;
		methodType?: IPaymentMethod["methodType"];
	}): Promise<IPaymentMethod[]>;
	create(methodData: IInsertPaymentMethod): Promise<IPaymentMethod>;
	update(id: string, methodData: IInsertPaymentMethod): Promise<IPaymentMethod>;
	delete(id: string): Promise<void>;
	deleteByTransactionId(transactionId: string): Promise<void>;
}

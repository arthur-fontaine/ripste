import type {
	IInsertTransaction,
	ITransaction,
} from "../models/ITransaction.ts";

export interface ITransactionRepository {
	findById(id: string): Promise<ITransaction | null>;
	findByReference(reference: string): Promise<ITransaction | null>;
	findByStoreId(
		storeId: string,
		options?: { limit: number | null },
	): Promise<ITransaction[]>;
	create(transactionData: IInsertTransaction): Promise<ITransaction>;
	update(
		id: string,
		transactionData: IInsertTransaction,
	): Promise<ITransaction>;
	delete(id: string): Promise<void>;
}

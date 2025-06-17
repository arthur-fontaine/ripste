import type { IInsertStore, IStore } from "../models/IStore.ts";
import type {
	IInsertStoreStatus,
	IStoreStatus,
} from "../models/IStoreStatus.ts";

export interface IStoreRepository {
	findById(id: string): Promise<IStore | null>;
	findMany(params: { companyId?: string }): Promise<IStore[]>;
	create(storeData: IInsertStore): Promise<IStore>;
	update(id: string, storeData: IInsertStore): Promise<IStore>;
	delete(id: string): Promise<void>;
	getStatus(params: {
		storeId?: string;
		changedByUserId?: string;
		status?: IStoreStatus["status"];
		limit?: number;
	}): Promise<IStoreStatus[]>;
	addStatus(statusData: IInsertStoreStatus): Promise<IStoreStatus>;
	updateStatus(
		id: string,
		statusData: IInsertStoreStatus,
	): Promise<IStoreStatus>;
	deleteStatus(id: string): Promise<void>;
}

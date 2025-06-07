import type {
	IInsertStoreStatus,
	IStoreStatus,
} from "../models/IStoreStatus.ts";

export interface IStoreStatusRepository {
	findById(id: string): Promise<IStoreStatus | null>;
	findByStoreId(storeId: string): Promise<IStoreStatus[]>;
	findCurrentStatus(storeId: string): Promise<IStoreStatus | null>;
	findByChangedByUserId(userId: string): Promise<IStoreStatus[]>;
	findStoresByStatus(status: IStoreStatus["status"]): Promise<IStoreStatus[]>;
	findStatusHistory(storeId: string, limit?: number): Promise<IStoreStatus[]>;
	create(statusData: IInsertStoreStatus): Promise<IStoreStatus>;
	update(id: string, statusData: IInsertStoreStatus): Promise<IStoreStatus>;
	delete(id: string): Promise<void>;
}

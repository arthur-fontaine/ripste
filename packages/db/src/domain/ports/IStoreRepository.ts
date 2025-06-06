import type { IInsertStore, IStore } from "../models/IStore.ts";

export interface IStoreRepository {
	findById(id: string): Promise<IStore | null>;
	findByCompanyId(companyId: string): Promise<IStore[]>;
	create(storeData: IInsertStore): Promise<IStore>;
	update(id: string, storeData: IInsertStore): Promise<IStore>;
	delete(id: string): Promise<void>;
}

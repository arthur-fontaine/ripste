import type {
	IStore,
	IInsertStore,
	IUpdateStore,
} from "../../models/IStore.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreRepository
	extends IBaseRepository<IStore, IInsertStore, IUpdateStore> {}

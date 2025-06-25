import type {
	IStoreStatus,
	IInsertStoreStatus,
	IUpdateStoreStatus,
} from "../../models/IStoreStatus.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreStatusRepository
	extends IBaseRepository<
		IStoreStatus,
		IInsertStoreStatus,
		IUpdateStoreStatus
	> {}

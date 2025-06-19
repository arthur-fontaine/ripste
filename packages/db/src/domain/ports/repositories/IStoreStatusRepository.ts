import type { IStoreStatus, IStoreStatusInsert, IStoreStatusUpdate } from "../../models/StoreStatus.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreStatusRepository extends IBaseRepository<IStoreStatus, IStoreStatusInsert, IStoreStatusUpdate> {}

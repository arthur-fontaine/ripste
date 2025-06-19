import type { IStore, IStoreInsert, IStoreUpdate } from "../../models/Store.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreRepository extends IBaseRepository<IStore, IStoreInsert, IStoreUpdate> {}

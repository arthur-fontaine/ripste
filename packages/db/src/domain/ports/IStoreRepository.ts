import type { Store } from "../models/Store.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IStoreRepository extends IBaseRepository<Store> {}

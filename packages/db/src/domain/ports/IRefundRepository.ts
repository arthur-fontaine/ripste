import type { Refund } from "../models/Refund.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IRefundRepository extends IBaseRepository<Refund> {}

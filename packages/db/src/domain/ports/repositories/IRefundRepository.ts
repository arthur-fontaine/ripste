import type { IRefund, IRefundInsert, IRefundUpdate } from "../../models/Refund.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IRefundRepository extends IBaseRepository<IRefund, IRefundInsert, IRefundUpdate> { }

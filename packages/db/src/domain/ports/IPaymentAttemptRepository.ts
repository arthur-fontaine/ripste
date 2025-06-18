import type { IPaymentAttempt } from "../models/PaymentAttempt.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IPaymentAttemptRepository extends IBaseRepository<IPaymentAttempt> {}

import type { PaymentAttempt } from "../models/PaymentAttempt.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IPaymentAttemptRepository extends IBaseRepository<PaymentAttempt> {}

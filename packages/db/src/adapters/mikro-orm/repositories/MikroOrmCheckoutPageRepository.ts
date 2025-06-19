import type {
	ICheckoutPage,
	ICheckoutPageInsert,
	ICheckoutPageUpdate,
} from "../../../domain/models/CheckoutPage.ts";
import type { ICheckoutPageRepository } from "../../../domain/ports/repositories/ICheckoutPageRepository.ts";
import { MikroOrmCheckoutPageModel } from "../models/MikroOrmCheckoutPageModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmCheckoutPageRepository
	extends MikroOrmBaseRepository<
		ICheckoutPage,
		ICheckoutPageInsert,
		ICheckoutPageUpdate
	>(MikroOrmCheckoutPageModel)
	implements ICheckoutPageRepository {}

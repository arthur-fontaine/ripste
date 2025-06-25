import type {
	ICheckoutPage,
	IInsertCheckoutPage,
	IUpdateCheckoutPage,
} from "../../../domain/models/ICheckoutPage.ts";
import type { ICheckoutPageRepository } from "../../../domain/ports/repositories/ICheckoutPageRepository.ts";
import { MikroOrmCheckoutPageModel } from "../models/MikroOrmCheckoutPageModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmCheckoutPageRepository
	extends MikroOrmBaseRepository<
		ICheckoutPage,
		IInsertCheckoutPage,
		IUpdateCheckoutPage
	>(MikroOrmCheckoutPageModel)
	implements ICheckoutPageRepository {}

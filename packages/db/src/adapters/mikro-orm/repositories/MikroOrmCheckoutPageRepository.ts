import type { ICheckoutPageRepository } from "../../../domain/ports/repositories/ICheckoutPageRepository.ts";
import { MikroOrmCheckoutPageModel } from "../models/MikroOrmCheckoutPageModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmCheckoutPageRepository
	extends MikroOrmBaseRepository(MikroOrmCheckoutPageModel)
	implements ICheckoutPageRepository {}

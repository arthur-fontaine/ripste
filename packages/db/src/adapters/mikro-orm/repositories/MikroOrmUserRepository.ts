import type { IUserRepository } from "../../../domain/ports/repositories/IUserRepository.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmUserRepository
	extends MikroOrmBaseRepository(MikroOrmUserModel)
	implements IUserRepository {}

import type {
	IUser,
	IUserInsert,
	IUserUpdate,
} from "../../../domain/models/User.ts";
import type { IUserRepository } from "../../../domain/ports/repositories/IUserRepository.ts";
import { MikroOrmUserModel } from "../models/MikroOrmUserModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";

export class MikroOrmUserRepository
	extends MikroOrmBaseRepository<IUser, IUserInsert, IUserUpdate>(
		MikroOrmUserModel,
	)
	implements IUserRepository {}

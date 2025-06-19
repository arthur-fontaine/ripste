import { MikroOrmUserProfileModel } from "../models/MikroOrmUserProfileModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IUserProfileRepository } from "../../../domain/ports/IUserProfileRepository.ts";

export class MikroOrmUserProfileRepository
	extends MikroOrmBaseRepository(MikroOrmUserProfileModel)
	implements IUserProfileRepository {}

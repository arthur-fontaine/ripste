import { MikroOrmUserProfileModel } from "../models/MikroOrmUserProfileModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IUserProfileRepository } from "../../../domain/ports/repositories/IUserProfileRepository.ts";
import type {
	IUserProfile,
	IInsertUserProfile,
	IUpdateUserProfile,
} from "../../../domain/models/IUserProfile.ts";

export class MikroOrmUserProfileRepository
	extends MikroOrmBaseRepository<
		IUserProfile,
		IInsertUserProfile,
		IUpdateUserProfile
	>(MikroOrmUserProfileModel)
	implements IUserProfileRepository {}

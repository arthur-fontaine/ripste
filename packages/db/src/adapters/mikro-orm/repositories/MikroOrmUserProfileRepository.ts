import { MikroOrmUserProfileModel } from "../models/MikroOrmUserProfileModel.ts";
import { MikroOrmBaseRepository } from "./utils/MikroOrmBaseRepository.ts";
import type { IUserProfileRepository } from "../../../domain/ports/repositories/IUserProfileRepository.ts";
import type {
	IUserProfile,
	IUserProfileInsert,
	IUserProfileUpdate,
} from "../../../domain/models/UserProfile.ts";

export class MikroOrmUserProfileRepository
	extends MikroOrmBaseRepository<
		IUserProfile,
		IUserProfileInsert,
		IUserProfileUpdate
	>(MikroOrmUserProfileModel)
	implements IUserProfileRepository {}

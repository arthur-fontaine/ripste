import type {
	IUserProfile,
	IInsertUserProfile,
	IUpdateUserProfile,
} from "../../models/IUserProfile.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IUserProfileRepository
	extends IBaseRepository<
		IUserProfile,
		IInsertUserProfile,
		IUpdateUserProfile
	> {}

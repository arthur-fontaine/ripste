import type { IUserProfile, IUserProfileInsert, IUserProfileUpdate } from "../../models/UserProfile.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IUserProfileRepository extends IBaseRepository<IUserProfile, IUserProfileInsert, IUserProfileUpdate> {}

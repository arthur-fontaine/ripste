import type { IUser, IInsertUser, IUpdateUser } from "../../models/IUser.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IUserRepository
	extends IBaseRepository<IUser, IInsertUser, IUpdateUser> {}

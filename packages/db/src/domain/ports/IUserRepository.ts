import type { IUser } from "../models/User.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IUserRepository extends IBaseRepository<IUser> {}

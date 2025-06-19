import type { IUser, IUserInsert, IUserUpdate } from "../../models/User.ts";
import type { IBaseRepository } from "./utils/IBaseRepository.ts";

export interface IUserRepository extends IBaseRepository<IUser, IUserInsert, IUserUpdate> {}

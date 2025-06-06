import type { IInsertUser, IUser } from "../models/IUser.ts";

export interface IUserRepository {
	findById(id: string): Promise<IUser | null>;
	findByEmail(email: string): Promise<IUser | null>;
	create(user: IInsertUser): Promise<IUser>;
	update(id: string, user: IInsertUser): Promise<IUser>;
	delete(id: string): Promise<void>;
	softDelete(id: string): Promise<void>;
}

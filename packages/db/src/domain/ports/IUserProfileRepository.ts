import type {
	IInsertUserProfile,
	IUserProfile,
} from "../models/IUserProfile.ts";

export interface IUserProfileRepository {
	findById(id: string): Promise<IUserProfile | null>;
	findByUserId(userId: string): Promise<IUserProfile | null>;
	findByPhone(phone: string): Promise<IUserProfile[]>;
	findByFullName(
		firstName?: string,
		lastName?: string,
	): Promise<IUserProfile[]>;
	searchByName(searchTerm: string): Promise<IUserProfile[]>;
	create(profileData: IInsertUserProfile): Promise<IUserProfile>;
	update(id: string, profileData: IInsertUserProfile): Promise<IUserProfile>;
	updateByUserId(
		userId: string,
		profileData: IInsertUserProfile,
	): Promise<IUserProfile>;
	delete(id: string): Promise<void>;
	deleteByUserId(userId: string): Promise<void>;
}

import type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
} from "../models/ICheckoutTheme.ts";

export interface ICheckoutThemeRepository {
	findById(id: string): Promise<ICheckoutTheme | null>;
	findByStoreId(storeId: string): Promise<ICheckoutTheme[]>;
	findByName(name: string): Promise<ICheckoutTheme[]>;
	findByStoreAndName(storeId: string, name: string): Promise<ICheckoutTheme[]>;
	findLatestVersion(
		storeId: string,
		name: string,
	): Promise<ICheckoutTheme | null>;
	findByStoreNameAndVersion(
		storeId: string,
		name: string,
		version: number,
	): Promise<ICheckoutTheme | null>;
	getNextVersion(storeId: string, name: string): Promise<number>;
	create(themeData: IInsertCheckoutTheme): Promise<ICheckoutTheme>;
	update(id: string, themeData: IInsertCheckoutTheme): Promise<ICheckoutTheme>;
	delete(id: string): Promise<void>;
	deleteByStoreId(storeId: string): Promise<void>;
}

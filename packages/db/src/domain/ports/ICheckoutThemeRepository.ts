import type {
	ICheckoutTheme,
	IInsertCheckoutTheme,
} from "../models/ICheckoutTheme.ts";

export interface ICheckoutThemeRepository {
	findById(id: string): Promise<ICheckoutTheme | null>;
	findMany(params: {
		storeId?: string;
		name?: string;
		version?: number;
		latestVersion?: boolean;
	}): Promise<ICheckoutTheme[]>;
	getNextVersion(storeId: string, name: string): Promise<number>;
	create(themeData: IInsertCheckoutTheme): Promise<ICheckoutTheme>;
	update(id: string, themeData: IInsertCheckoutTheme): Promise<ICheckoutTheme>;
	delete(id: string): Promise<void>;
}

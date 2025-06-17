import type {
	ICheckoutPage,
	IInsertCheckoutPage,
} from "../models/ICheckoutPage.ts";

export interface ICheckoutPageRepository {
	findById(id: string): Promise<ICheckoutPage | null>;
	findMany(params: {
		transactionId?: string;
		themeId?: string;
		expired?: boolean;
		uri?: string;
		accessed?: boolean;
		completed?: boolean;
		pending?: boolean;
		fromDate?: Date;
		toDate?: Date;
	}): Promise<ICheckoutPage[]>;
	markAsAccessed(id: string): Promise<ICheckoutPage>;
	markAsCompleted(id: string): Promise<ICheckoutPage>;
	create(pageData: IInsertCheckoutPage): Promise<ICheckoutPage>;
	update(id: string, pageData: IInsertCheckoutPage): Promise<ICheckoutPage>;
	delete(id: string): Promise<void>;
	deleteExpiredPages(): Promise<void>;
}

import type {
	ICheckoutPage,
	IInsertCheckoutPage,
} from "../models/ICheckoutPage.ts";

export interface ICheckoutPageRepository {
	findById(id: string): Promise<ICheckoutPage | null>;
	findByUri(uri: string): Promise<ICheckoutPage | null>;
	findByTransactionId(transactionId: string): Promise<ICheckoutPage[]>;
	findByThemeId(themeId: string): Promise<ICheckoutPage[]>;
	findExpiredPages(): Promise<ICheckoutPage[]>;
	findAccessedPages(fromDate?: Date, toDate?: Date): Promise<ICheckoutPage[]>;
	findCompletedPages(fromDate?: Date, toDate?: Date): Promise<ICheckoutPage[]>;
	findPendingPages(): Promise<ICheckoutPage[]>;
	markAsAccessed(id: string): Promise<ICheckoutPage>;
	markAsCompleted(id: string): Promise<ICheckoutPage>;
	create(pageData: IInsertCheckoutPage): Promise<ICheckoutPage>;
	update(id: string, pageData: IInsertCheckoutPage): Promise<ICheckoutPage>;
	delete(id: string): Promise<void>;
	deleteExpiredPages(): Promise<void>;
}

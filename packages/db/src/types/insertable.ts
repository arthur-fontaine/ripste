export type Insertable<T, K extends keyof T = never> = Omit<
	T,
	"id" | "createdAt" | "updatedAt" | "deletedAt" | K
>;

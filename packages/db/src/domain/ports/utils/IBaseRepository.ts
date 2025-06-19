export interface IBaseRepository<M extends { id: unknown }> {
	findOne(id: M["id"]): Promise<M | null>;
	findAll(): Promise<M[]>;
	insert(item: M): Promise<M>;
	update(id: M["id"], item: Partial<M>): Promise<M | null>;
	delete(id: M["id"]): Promise<boolean>;
}

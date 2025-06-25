export interface IBaseRepository<
	Selectable extends { id: unknown },
	Insertable,
	Updatable = Partial<Insertable>,
> {
	findOne(id: Selectable["id"]): Promise<Selectable | null>;
	findAll(): Promise<Selectable[]>;
	insert(item: Insertable): Promise<Selectable>;
	update(id: Selectable["id"], item: Updatable): Promise<Selectable | null>;
	delete(id: Selectable["id"]): Promise<boolean>;
}

export interface IBaseRepository<
	Selectable extends { id: unknown },
	Insertable,
	Updatable = Partial<Insertable>,
> {
	findOne(id: Selectable["id"]): Promise<Selectable | null>;
	findMany(query?: IFindManyQuery<Selectable>): Promise<Selectable[]>;
	insert(item: Insertable): Promise<Selectable>;
	update(id: Selectable["id"], item: Updatable): Promise<Selectable | null>;
	delete(id: Selectable["id"]): Promise<boolean>;
}

type IFindManyQuery<Selectable> = Partial<{
	[K in keyof Selectable]: Selectable[K] | { $in: Selectable[K][] };
}>;

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

type IFindManyQuery<Selectable> =
	Selectable extends Array<infer T>
	? IFindManyQuery<T>
	: Partial<{
		[K in keyof Selectable as K extends `${string}Id` ? never : K]: Partial<Selectable[K]> | { $in: Partial<Selectable[K]>[] };
	}>;

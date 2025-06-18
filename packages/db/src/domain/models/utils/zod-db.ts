import { z, type core } from "zod/v4-mini";

export * from "zod/v4-mini";

const generatedSymbol = Symbol("generated");
type Generated<T extends z.ZodMiniType> = T & { [generatedSymbol]: true };
export const generated = <T extends z.ZodMiniType>(schema: T): Generated<T> => {
	return Object.assign(schema, { [generatedSymbol]: true }) as never;
};

export const timestamps = () => ({
	createdAt: generated(z.iso.datetime()),
	updatedAt: z.nullable(z.iso.datetime()),
	deletedAt: z.nullable(z.iso.datetime()),
});

const relationOneSourceNameSymbol = Symbol("relationOneSourceName");
const relationOneTargetNameSymbol = Symbol("relationOneTargetName");
type OneRelation<
	T extends z.ZodMiniType,
	S extends string,
	R extends keyof NonNullable<z.infer<T>>,
> = T & {
	[relationOneSourceNameSymbol]: S;
	[relationOneTargetNameSymbol]: R;
};
const relationManySymbol = Symbol("relationMany");
export type ManyRelation<T extends z.ZodMiniType> = z.ZodMiniArray<T> & {
	[relationManySymbol]: true;
};
export const relation = {
	one: <
		T extends z.ZodMiniType,
		S extends string,
		R extends keyof NonNullable<z.infer<T>>,
	>(
		relationSourceName: S,
		relatedSchemaLazy: () => T,
		relationTargetName: R,
	): OneRelation<T, S, R> => {
		return Object.assign(z.lazy(relatedSchemaLazy), {
			[relationOneSourceNameSymbol]: relationSourceName,
			[relationOneTargetNameSymbol]: relationTargetName,
		}) as never;
	},
	many: <T extends z.ZodMiniType>(
		relatedSchemaLazy: () => T,
	): ManyRelation<T> => {
		return Object.assign(z.lazy(relatedSchemaLazy), {
			[relationManySymbol]: true,
		}) as never;
	},
};

export const table = <T extends core.$ZodLooseShape>(shape: T) => {
	const schema = z.object(shape);

	return {
		select: createSelectSchema(schema),
		insert: createInsertSchema(schema),
		update: createUpdateSchema(schema),
	};
};

function createSelectSchema<T extends core.$ZodLooseShape>(
	schema: z.ZodMiniObject<T>,
) {
	return schema;
}

function createInsertSchema<T extends core.$ZodLooseShape>(
	schema: z.ZodMiniObject<T>,
): z.ZodMiniObject<{
	[K in keyof T as T[K] extends Generated<z.ZodMiniType>
		? never
		: T[K] extends OneRelation<infer _, infer R, infer _1>
			? R
			: T[K] extends ManyRelation<infer _>
				? never
				: K]: T[K] extends OneRelation<infer U, string, infer R>
		? R extends keyof NonNullable<z.infer<U>>
			? null extends z.infer<U>
				? z.ZodMiniNullable<z.ZodMiniType<NonNullable<z.infer<U>>[R]>>
				: z.ZodMiniType<NonNullable<z.infer<U>>[R]>
			: never
		: T[K];
}> {
	const shape = { ...schema.shape };
	for (const key in shape) {
		if (shape[key]?.[generatedSymbol]) {
			delete shape[key];
		}
		if (shape[key]?.[relationManySymbol]) {
			delete shape[key];
		}
	}
	return z.object(shape);
}

function createUpdateSchema<T extends core.$ZodLooseShape>(
	schema: z.ZodMiniObject<T>,
) {
	return z.partial(createInsertSchema(schema));
}

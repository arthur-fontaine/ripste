import type { EntityManager, FilterQuery, EntityClass } from "@mikro-orm/core";

export interface IMikroormRepositoryOptions {
	em: EntityManager;
}

/**
 * Find entity by ID with soft delete filter
 */
export async function findById<
	TEntity extends { id: string; deletedAt?: Date | null },
	TModel extends TEntity,
>(
	em: EntityManager,
	entityClass: EntityClass<TModel>,
	id: string,
	populateFields: (keyof TModel)[] | readonly (keyof TModel)[] = [],
): Promise<TEntity | null> {
	const entity = await em.findOne(
		entityClass,
		{
			id,
			deletedAt: null,
		} as FilterQuery<TModel>,
		{
			populate: populateFields as never,
		},
	);
	return entity as TEntity | null;
}

/**
 * Find multiple entities with soft delete filter and custom where clause
 */
export async function findMany<
	TEntity extends { id: string; deletedAt?: Date | null },
	TModel extends TEntity,
>(
	em: EntityManager,
	entityClass: EntityClass<TModel>,
	whereClause: Partial<FilterQuery<TModel>> = {},
	populateFields: (keyof TModel)[] | readonly (keyof TModel)[] = [],
): Promise<TEntity[]> {
	const combinedWhere = Object.assign({}, whereClause, {
		deletedAt: null,
	}) as FilterQuery<TModel>;

	const entities = await em.find(entityClass, combinedWhere, {
		populate: populateFields as never,
	});
	return entities as TEntity[];
}

/**
 * Update an existing entity by ID
 */
export async function updateEntity<
	TEntity extends { id: string; deletedAt?: Date | null },
	TModel extends TEntity,
>(
	em: EntityManager,
	entityClass: EntityClass<TModel>,
	id: string,
	updateData: Record<string, unknown>,
	populateFields: (keyof TModel)[] | readonly (keyof TModel)[] = [],
): Promise<TEntity> {
	const entity = await em.findOne(
		entityClass,
		{
			id,
			deletedAt: null,
		} as FilterQuery<TModel>,
		{
			populate: populateFields as never,
		},
	);

	if (!entity) {
		throw new Error(`${entityClass.name} with id ${id} not found`);
	}

	const filteredUpdateData = filterUpdateData(updateData);

	em.assign(entity, filteredUpdateData as never);
	await em.flush();
	return entity as TEntity;
}

/**
 * Soft delete an entity by setting deletedAt
 */
export async function deleteEntity<
	TEntity extends { id: string; deletedAt?: Date | null },
	TModel extends TEntity,
>(
	em: EntityManager,
	entityClass: EntityClass<TModel>,
	id: string,
): Promise<void> {
	const entity = await em.findOne(entityClass, {
		id,
		deletedAt: null,
	} as FilterQuery<TModel>);

	if (!entity) {
		return;
	}

	(entity as TEntity & { deletedAt: Date }).deletedAt = new Date();
	await em.flush();
}

/**
 * Hard delete an entity (completely remove from database)
 */
export async function hardDeleteEntity<TModel extends { id: string }>(
	em: EntityManager,
	entityClass: EntityClass<TModel>,
	id: string,
): Promise<void> {
	const entity = await em.findOne(entityClass, { id } as FilterQuery<TModel>);

	if (!entity) {
		return;
	}

	await em.removeAndFlush(entity);
}

/**
 * Find and validate a related entity exists
 */
export async function findRelatedEntity<
	T extends { id: string; deletedAt?: Date | null },
>(
	em: EntityManager,
	entityClass: EntityClass<T>,
	id: string,
	entityName?: string,
): Promise<T> {
	const entity = await em.findOne(entityClass, {
		id,
		deletedAt: null,
	} as FilterQuery<T>);

	if (!entity) {
		throw new Error(
			`${entityName || entityClass.name} with id ${id} not found`,
		);
	}

	return entity;
}

/**
 * Filter undefined values from update data
 */
export function filterUpdateData<T extends Record<string, unknown>>(
	data: T,
): Partial<T> {
	return Object.fromEntries(
		Object.entries(data).filter(([_, value]) => value !== undefined),
	) as Partial<T>;
}

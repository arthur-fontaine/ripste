import type { EntityManager } from "@mikro-orm/core";
import type { BaseModel } from "../../models/utils/MikroOrmBaseModel.ts";
import type { IBaseRepository } from "../../../../domain/ports/repositories/utils/IBaseRepository.ts";

export interface IMikroOrmBaseRepositoryOptions {
	em: EntityManager;
}

export function MikroOrmBaseRepository<
	Selectable extends Omit<BaseModel, "_loadEm" | "_em">,
	Insertable,
	Updatable,
>(model: new (...args: never) => NoInfer<Selectable>) {
	type I = IBaseRepository<Selectable, Insertable, Updatable>;

	return class MikroOrmBaseRepository implements I {
		#em: EntityManager;

		constructor(options: IMikroOrmBaseRepositoryOptions) {
			this.#em = options.em;
		}

		/** @deprecated */
		get _em(): EntityManager {
			return this.#em;
		}

		findOne: I["findOne"] = async (id) => {
			const entity = await this.#em.findOne(model, {
				id,
				deletedAt: null,
			});
			return entity || null;
		};

		findMany: I["findMany"] = async (query) => {
			const entities = await this.#em.find(model, {
				...query,
				deletedAt: null,
			});
			return entities;
		};

		insert: I["insert"] = async (entity) => {
			const newEntity = this.#em.create(model, entity as never);
			await this.#em.persistAndFlush(newEntity);
			return newEntity;
		};

		update: I["update"] = async (id, entity) => {
			const existingEntity = await this.#em.findOne(model, { id });
			if (!existingEntity) return null;
			Object.assign(existingEntity, entity);
			existingEntity.updatedAt = new Date();
			await this.#em.persistAndFlush(existingEntity);
			return existingEntity;
		};

		delete: I["delete"] = async (id) => {
			const entity = await this.#em.findOne(model, { id });
			if (!entity) {
				throw new Error("Entity not found");
			}
			entity.deletedAt = new Date();
			await this.#em.persistAndFlush(entity);
			return entity;
		};
	};
}

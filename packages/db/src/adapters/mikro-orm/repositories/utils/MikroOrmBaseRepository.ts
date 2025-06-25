import type { EntityManager } from "@mikro-orm/core";
import type { BaseModel } from "../../models/utils/MikroOrmBaseModel.ts";
import type { IBaseRepository } from "../../../../domain/ports/repositories/utils/IBaseRepository.ts";

interface IMikroOrmBaseRepositoryOptions {
	em: EntityManager;
}

export function MikroOrmBaseRepository<
	Selectable extends BaseModel,
	Insertable,
	Updatable,
>(model: new (...args: never) => Selectable) {
	type I = IBaseRepository<Selectable, Insertable, Updatable>;

	return class MikroOrmBaseRepository implements I {
		#em: EntityManager;

		constructor(options: IMikroOrmBaseRepositoryOptions) {
			this.#em = options.em;
		}

		findOne: I["findOne"] = async (id) => {
			const entity = await this.#em.findOne(model, {
				id,
				deletedAt: null,
			});
			return entity || null;
		};

		findAll: I["findAll"] = async () => {
			throw new Error("Method not implemented.");
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

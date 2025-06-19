import type { EntityManager } from "@mikro-orm/core";
import type { BaseModel } from "../../models/utils/MikroOrmBaseModel.ts";
import type { IBaseRepository } from "../../../../domain/ports/utils/IBaseRepository.ts";

interface IMikroOrmBaseRepositoryOptions {
	em: EntityManager;
}

export function MikroOrmBaseRepository<T extends BaseModel>(
	model: new (...args: never) => T,
) {
	return class MikroOrmBaseRepository implements IBaseRepository<T> {
		#em: EntityManager;

		constructor(options: IMikroOrmBaseRepositoryOptions) {
			this.#em = options.em;
		}

		findOne: IBaseRepository<T>["findOne"] = async (id) => {
			const entity = await this.#em.findOne(model, {
				id,
				deletedAt: null,
			});
			return entity || null;
		};

		findAll: IBaseRepository<T>["findAll"] = async () => {
			throw new Error("Method not implemented.");
		};

		insert: IBaseRepository<T>["insert"] = async (entity) => {
			const newEntity = this.#em.create(model, entity);
			await this.#em.persistAndFlush(newEntity);
			return newEntity;
		};

		update: IBaseRepository<T>["update"] = async (id, entity) => {
			const existingEntity = await this.#em.findOne(model, { id });
			if (!existingEntity) return null;
			Object.assign(existingEntity, entity);
			existingEntity.updatedAt = new Date();
			await this.#em.persistAndFlush(existingEntity);
			return existingEntity;
		};

		delete: IBaseRepository<T>["delete"] = async (id) => {
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

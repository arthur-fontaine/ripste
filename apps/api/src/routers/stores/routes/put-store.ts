import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { storeOwnerMiddleware } from "../../../middlewares/storeAccessMiddleware.ts";
import { updateStoreSchema } from "../schemas.ts";
import type { IUpdateStore } from "@ripste/db/mikro-orm";

export const putStoreRoute = createHonoRouter().put(
	"/:id",
	vValidator(
		"json",
		v.config(updateStoreSchema, { abortEarly: true }),
		vValidatorThrower,
	),
	protectedRouteMiddleware,
	storeOwnerMiddleware,
	async (c) => {
		try {
			const id = c.req.param("id");
			const validatedData = c.req.valid("json");

			const updateData: IUpdateStore = {};

			if (validatedData.name !== undefined) {
				updateData.name = validatedData.name;
			}
			if (validatedData.slug !== undefined) {
				updateData.slug = validatedData.slug;
			}
			if (validatedData.contactEmail !== undefined) {
				updateData.contactEmail = validatedData.contactEmail;
			}
			if (validatedData.contactPhone !== undefined) {
				updateData.contactPhone = validatedData.contactPhone;
			}

			const updatedStore = await database.store.update(id, updateData);

			return c.json({
				data: updatedStore,
			});
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("unique") ||
					error.message.includes("UNIQUE") ||
					error.message.includes("duplicate") ||
					error.message.includes("slug") ||
					error.message.includes("constraint") ||
					error.message.includes("CONSTRAINT")
				) {
					return c.json(
						{ error: "A store with this slug already exists" },
						400,
					);
				}
			}

			console.error("Error updating store:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);

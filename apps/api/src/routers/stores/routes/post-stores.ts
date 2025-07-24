import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { companyOwnerFromUserMiddleware } from "../../../middlewares/companyAccessMiddleware.ts";
import { createStoreSchema } from "../schemas.ts";
import type { IInsertStore } from "@ripste/db/mikro-orm";

export const postStoresRoute = createHonoRouter().post(
	"/",
	vValidator(
		"json",
		v.config(createStoreSchema, { abortEarly: true }),
		vValidatorThrower,
	),
	protectedRouteMiddleware,
	companyOwnerFromUserMiddleware,
	async (c) => {
		try {
			const validatedData = c.req.valid("json");
			const company = c.get("company");

			const storeData: IInsertStore = {
				name: validatedData.name,
				slug: validatedData.slug,
				contactEmail: validatedData.contactEmail,
				contactPhone: validatedData.contactPhone ?? null,
				companyId: company.id,
			};

			const store = await database.store.insert(storeData);

			const existingMember = await database.storeMember.findMany({
				user: { id: c.get("user").id },
				store: { id: store.id },
			});

			if (existingMember.length === 0) {
				await database.storeMember.insert({
					userId: c.get("user").id,
					storeId: store.id,
					permissionLevel: "owner",
				});
			}

			return c.json(
				{
					data: store,
				},
				201,
			);
		} catch (error) {
			if (error instanceof Error) {
				if (error.name === "ForeignKeyConstraintViolationException") {
					return c.json({ error: "User does not exist" }, 400);
				}

				if (error.name === "UniqueConstraintViolationException") {
					return c.json(
						{ error: "User is already a member of this store" },
						400,
					);
				}
			}

			return c.json({ error: "Internal server error" }, 500);
		}
	},
);

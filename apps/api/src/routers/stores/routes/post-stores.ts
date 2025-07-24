import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
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
	async (c) => {
		try {
			const validatedData = c.req.valid("json");

			const company = await database.company.findOne(validatedData.companyId);
			if (!company) {
				return c.json({ error: "Company not found" }, 404);
			}

			const storeData: IInsertStore = {
				name: validatedData.name,
				slug: validatedData.slug,
				contactEmail: validatedData.contactEmail,
				contactPhone: validatedData.contactPhone ?? null,
				companyId: validatedData.companyId,
			};

			const store = await database.store.insert(storeData);

			console.log("Store created:", store);
			console.log("User ID:", c.get("user").id);
			const users = await database.user.findMany({});
			console.log("Users", users);

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
			console.log("Error creating store:", error);
			if (error instanceof Error) {
				if (
					(error.message.includes("unique") ||
						error.message.includes("UNIQUE") ||
						error.message.includes("duplicate") ||
						error.message.includes("constraint") ||
						error.message.includes("CONSTRAINT")) &&
					error.message.includes("slug")
				) {
					return c.json(
						{ error: "A store with this slug already exists" },
						400,
					);
				}

				if (
					error.message.includes("FOREIGN KEY constraint failed") ||
					error.message.includes("ForeignKeyConstraintViolationException")
				) {
					return c.json({ error: "User does not exist" }, 400);
				}

				if (
					(error.message.includes("unique") ||
						error.message.includes("UNIQUE") ||
						error.message.includes("duplicate") ||
						error.message.includes("constraint") ||
						error.message.includes("CONSTRAINT")) &&
					(error.message.includes("storeMember") ||
						error.message.includes("store_member"))
				) {
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

import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { companyAccessMiddleware } from "../../../middlewares/companyAccessMiddleware.ts";
import { updateCompanySchema } from "../schemas.ts";
import type { IUpdateCompany } from "@ripste/db/mikro-orm";

export const putCompanyRoute = createHonoRouter().put(
	"/:id",
	vValidator(
		"json",
		v.config(updateCompanySchema, { abortEarly: true }),
		vValidatorThrower,
	),
	protectedRouteMiddleware,
	companyAccessMiddleware,
	async (c) => {
		try {
			const company = c.get("company");
			const validatedData = c.req.valid("json");

			const updateData: IUpdateCompany = {};

			if (validatedData.legalName !== undefined) {
				updateData.legalName = validatedData.legalName;
			}
			if (validatedData.tradeName !== undefined) {
				updateData.tradeName = validatedData.tradeName || null;
			}
			if (validatedData.vatNumber !== undefined) {
				updateData.vatNumber = validatedData.vatNumber || null;
			}
			if (validatedData.address !== undefined) {
				updateData.address = validatedData.address || null;
			}

			const updatedCompany = await database.company.update(
				company.id,
				updateData,
			);

			if (!updatedCompany) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.json(
				{
					data: updatedCompany,
				},
				200,
			);
		} catch (error) {
			console.error("Error updating company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);

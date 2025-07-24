import { vValidator } from "@hono/valibot-validator";
import * as v from "valibot";
import { vValidatorThrower } from "../../../utils/v-validator-thrower.ts";
import { createHonoRouter } from "../../../utils/create-hono-router.ts";
import { database } from "../../../database.ts";
import { protectedRouteMiddleware } from "../../../middlewares/protectedRouteMiddleware.ts";
import { createCompanySchema } from "../schemas.ts";
import type { IInsertCompany } from "@ripste/db/mikro-orm";

export const postCompaniesRoute = createHonoRouter().post(
	"/",
	vValidator(
		"json",
		v.config(createCompanySchema, { abortEarly: true }),
		vValidatorThrower,
	),
	protectedRouteMiddleware,
	async (c) => {
		try {
			const userId = c.get("user").id;
			const validatedData = c.req.valid("json");

			const existingCompanies = await database.company.findMany({
				user: { id: userId },
			});

			if (existingCompanies.length > 0) {
				return c.json({ error: "User already has a company" }, 400);
			}

			const companyData: IInsertCompany = {
				legalName: validatedData.legalName,
				tradeName: validatedData.tradeName ?? null,
				kbis: validatedData.kbis,
				vatNumber: validatedData.vatNumber ?? null,
				address: validatedData.address ?? null,
				userId,
			};

			const company = await database.company.insert(companyData);

			await database.user.update(userId, { companyId: company.id });

			return c.json(
				{
					data: company,
				},
				201,
			);
		} catch (error) {
			if (error instanceof Error) {
				if (error.name === "UniqueConstraintViolationException") {
					return c.json(
						{ error: "A company with this KBIS already exists" },
						400,
					);
				}
			}

			console.error("Error creating company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	},
);

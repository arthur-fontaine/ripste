import { Hono } from "hono";
import { database } from "../../database.ts";
import type { IInsertCompany, IUpdateCompany } from "@ripste/db/mikro-orm";

interface CreateCompanyRequest {
	legalName: string;
	tradeName?: string | null;
	kbis: string;
	vatNumber?: string | null;
	address?: string | null;
}

interface UpdateCompanyRequest {
	legalName?: string;
	tradeName?: string | null;
	kbis?: string;
	vatNumber?: string | null;
	address?: string | null;
}

function validateCompanyData(data: CreateCompanyRequest): CreateCompanyRequest {
	if (
		!data.legalName ||
		typeof data.legalName !== "string" ||
		data.legalName.trim() === ""
	) {
		throw new Error("Legal name is required");
	}

	if (!data.kbis || typeof data.kbis !== "string") {
		throw new Error("KBIS is required");
	}

	if (!/^\d{14}$/.test(data.kbis)) {
		throw new Error("KBIS must be exactly 14 digits");
	}

	return {
		legalName: data.legalName.trim(),
		tradeName: data.tradeName || null,
		kbis: data.kbis,
		vatNumber: data.vatNumber || null,
		address: data.address || null,
	};
}

function validateUpdateCompanyData(
	data: UpdateCompanyRequest,
): UpdateCompanyRequest {
	if (data.kbis !== undefined) {
		throw new Error("KBIS cannot be updated for security reasons");
	}

	if (data.legalName !== undefined) {
		if (
			!data.legalName ||
			typeof data.legalName !== "string" ||
			data.legalName.trim() === ""
		) {
			throw new Error("Legal name cannot be empty");
		}
	}

	const updateData: UpdateCompanyRequest = {};

	if (data.legalName !== undefined) {
		updateData.legalName = data.legalName.trim();
	}
	if (data.tradeName !== undefined) {
		updateData.tradeName = data.tradeName || null;
	}
	if (data.vatNumber !== undefined) {
		updateData.vatNumber = data.vatNumber || null;
	}
	if (data.address !== undefined) {
		updateData.address = data.address || null;
	}

	return updateData;
}

export const companyRouter = new Hono()
	.post("/", async (c) => {
		try {
			const body = await c.req.json();
			const validatedData = validateCompanyData(body);

			const companyData: IInsertCompany = {
				legalName: validatedData.legalName,
				tradeName: validatedData.tradeName ?? null,
				kbis: validatedData.kbis,
				vatNumber: validatedData.vatNumber ?? null,
				address: validatedData.address ?? null,
			};

			const company = await database.company.insert(companyData);

			return c.json(company, 201);
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("required") ||
					error.message.includes("must be")
				) {
					return c.json({ error: error.message }, 400);
				}

				if (
					error.message.includes("unique") ||
					error.message.includes("UNIQUE") ||
					error.message.includes("duplicate") ||
					error.message.includes("kbis")
				) {
					return c.json(
						{ error: "A company with this KBIS already exists" },
						400,
					);
				}
			}

			console.error("Error creating company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.get("/", async (c) => {
		try {
			const companies = await database.company.findMany();
			return c.json(companies);
		} catch (error) {
			console.error("Error fetching companies:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.get("/:id", async (c) => {
		try {
			const id = c.req.param("id");
			const company = await database.company.findOne(id);

			if (!company) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.json(company);
		} catch (error) {
			console.error("Error fetching company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.put("/:id", async (c) => {
		try {
			const id = c.req.param("id");
			const body = await c.req.json();

			const validatedData = validateUpdateCompanyData(body);

			const existingCompany = await database.company.findOne(id);
			if (!existingCompany) {
				return c.json({ error: "Company not found" }, 404);
			}

			const updateData: IUpdateCompany = validatedData;

			const updatedCompany = await database.company.update(id, updateData);

			if (!updatedCompany) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.json(updatedCompany);
		} catch (error) {
			if (error instanceof Error) {
				if (
					error.message.includes("cannot be") ||
					error.message.includes("security reasons")
				) {
					return c.json({ error: error.message }, 400);
				}
			}

			console.error("Error updating company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	})
	.delete("/:id", async (c) => {
		try {
			const id = c.req.param("id");

			const existingCompany = await database.company.findOne(id);
			if (!existingCompany) {
				return c.json({ error: "Company not found" }, 404);
			}

			const deleted = await database.company.delete(id);

			if (!deleted) {
				return c.json({ error: "Company not found" }, 404);
			}

			return c.body(null, 204);
		} catch (error) {
			console.error("Error deleting company:", error);
			return c.json({ error: "Internal server error" }, 500);
		}
	});

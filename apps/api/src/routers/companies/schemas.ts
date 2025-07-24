import * as v from "valibot";

const KBIS_REGEX = /^\d{14}$/;

export const createCompanySchema = v.object({
	legalName: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Legal name is required"),
	),
	tradeName: v.optional(v.nullable(v.string()), null),
	kbis: v.pipe(
		v.string(),
		v.regex(KBIS_REGEX, "KBIS must be exactly 14 digits"),
	),
	vatNumber: v.optional(v.nullable(v.string()), null),
	address: v.optional(v.nullable(v.string()), null),
});

export const updateCompanySchema = v.object({
	legalName: v.optional(
		v.pipe(v.string(), v.trim(), v.minLength(1, "Legal name cannot be empty")),
	),
	tradeName: v.optional(v.nullable(v.string())),
	vatNumber: v.optional(v.nullable(v.string())),
	address: v.optional(v.nullable(v.string())),
	kbis: v.optional(
		v.pipe(
			v.any(),
			v.check(
				(value) => value === undefined,
				"KBIS cannot be updated for security reasons",
			),
		),
	),
});

export type CreateCompanyInput = v.InferInput<typeof createCompanySchema>;
export type UpdateCompanyInput = v.InferInput<typeof updateCompanySchema>;

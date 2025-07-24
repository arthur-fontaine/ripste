import * as v from "valibot";

const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(\+33|0)[1-9](\d{8})$/;

export const createStoreSchema = v.object({
	name: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Store name is required"),
		v.maxLength(255, "Store name is too long"),
	),
	slug: v.pipe(
		v.string(),
		v.trim(),
		v.minLength(1, "Store slug is required"),
		v.maxLength(255, "Store slug is too long"),
		v.regex(
			SLUG_REGEX,
			"Slug must contain only lowercase letters, numbers and hyphens",
		),
	),
	contactEmail: v.pipe(
		v.string(),
		v.trim(),
		v.regex(EMAIL_REGEX, "Invalid email format"),
	),
	contactPhone: v.optional(
		v.nullable(
			v.pipe(
				v.string(),
				v.trim(),
				v.regex(PHONE_REGEX, "Invalid French phone number format"),
			),
		),
		null,
	),
});

export const updateStoreSchema = v.object({
	name: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "Store name cannot be empty"),
			v.maxLength(255, "Store name is too long"),
		),
	),
	slug: v.optional(
		v.pipe(
			v.string(),
			v.trim(),
			v.minLength(1, "Store slug cannot be empty"),
			v.maxLength(255, "Store slug is too long"),
			v.regex(
				SLUG_REGEX,
				"Slug must contain only lowercase letters, numbers and hyphens",
			),
		),
	),
	contactEmail: v.optional(
		v.pipe(v.string(), v.trim(), v.regex(EMAIL_REGEX, "Invalid email format")),
	),
	contactPhone: v.optional(
		v.nullable(
			v.pipe(
				v.string(),
				v.trim(),
				v.regex(PHONE_REGEX, "Invalid French phone number format"),
			),
		),
	),
	companyId: v.optional(
		v.pipe(
			v.any(),
			v.check(
				(value) => value === undefined,
				"Company ID cannot be updated for security reasons",
			),
		),
	),
});

export type CreateStoreInput = v.InferInput<typeof createStoreSchema>;
export type UpdateStoreInput = v.InferInput<typeof updateStoreSchema>;

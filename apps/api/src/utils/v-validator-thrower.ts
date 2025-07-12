import type { Context } from "hono";
import type * as v from "valibot";

export const vValidatorThrower = (
	result: v.SafeParseResult<
		// biome-ignore lint/suspicious/noExplicitAny: This is needed to allow for flexible schemas
		v.ObjectSchemaAsync<Record<string, any>, undefined>
	>,
	c: Context,
) => {
	if (!result.success) {
		return c.json(
			{
				error: result.issues.map((issue) => issue.message).join(", "),
			},
			{ status: 400 },
		);
	}
	return undefined;
};

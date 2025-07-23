export function readBody<D, E>(
	data: { data: D; error?: E } | { error: E; data?: D },
): { data: D; error: E } {
	return {
		data: "data" in data ? data.data : (null as never),
		error: "error" in data ? data.error : (null as never),
	};
}

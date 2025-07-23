interface CacheOptions {
	ttl: number;
}

export class Cache {
	#cache: Map<string, { value: unknown; expiresAt: number }>;
	#ttl: number;

	constructor(options: CacheOptions) {
		this.#cache = new Map();
		this.#ttl = options.ttl;
	}

	async callWithCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
		const cached = this.#cache.get(key);
		if (cached && cached.expiresAt > Date.now()) {
			return cached.value as T;
		}

		const result = await fn();
		this.#cache.set(key, { value: result, expiresAt: Date.now() + this.#ttl });
		return result;
	}
}

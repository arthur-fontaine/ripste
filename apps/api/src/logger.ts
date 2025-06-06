import { pino } from "pino";
import { pinoLoki } from "pino-loki";
import packageJson from "../package.json" with { type: "json" };

const stream = pinoLoki({
	host: "http://loki:3100",
	labels: { app: packageJson.name },
	interval: 5_000, // Send logs every 5 seconds
	batching: true,
});

export const logger = pino({}, stream);

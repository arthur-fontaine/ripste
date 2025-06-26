import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { NodeSDK } from "@opentelemetry/sdk-node";
import packageJson from "../package.json" with { type: "json" };

export function initTraces(otlpUrl: string | undefined) {
	if (!otlpUrl)
		throw new Error("OTLP URL is required for OpenTelemetry tracing");

	const traceExporter = new OTLPTraceExporter({ url: otlpUrl });

	const otelSdk = new NodeSDK({
		serviceName: packageJson.name,
		traceExporter,
		instrumentations: [
			getNodeAutoInstrumentations({
				// Disable HTTP instrumentation to avoid conflicts with Hono middleware
				"@opentelemetry/instrumentation-http": { enabled: false },
			}),
		],
	});

	otelSdk.start();

	return async () => await otelSdk.shutdown();
}

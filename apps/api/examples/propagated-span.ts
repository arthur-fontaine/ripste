import { Hono } from "hono";
import { trace, context } from "@opentelemetry/api";

export const propagatedSpanRouter = new Hono()
  .get("/start", async (c) => {
    const span = trace.getSpan(context.active());
    if (!span) throw new Error("No active span found");

    const traceparent = `00-${span.spanContext().traceId}-${span.spanContext().spanId}-01`;

    span.addEvent("Start handler invoked");

    return c.text(`OK start ${traceparent}`, 200, {
      "traceparent": traceparent,
    });
  })
  .get("/step1", async (c) => {
    const span = trace.getSpan(context.active());
    if (!span) throw new Error("No active span found");

    span.addEvent("Step 1 triggered");
    return c.text("OK step1");
  })
  .get("/step2", async (c) => {
    const span = trace.getSpan(context.active());
    if (!span) throw new Error("No active span found");

    span.addEvent("Step 2 triggered");
    return c.text("OK step2");
  });

throw new Error("This file is not meant to be run directly. It is an example of how to use OpenTelemetry with Hono.");

import { testClient } from "hono/testing";
import { describe, it, expect } from "vitest";
import { app } from "../../../src/app.ts";

describe("Payments Router", () => {
	const client = testClient(app);

  describe("POST /payments/transactions", () => {
    it("should return 201 and a location header on successful payment creation", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "USD",
        },
      });

      expect(res.status).toBe(201);
      expect(res.headers.get("Location")).toBeDefined();
    });

    it("should return data with an id on successful payment creation", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "USD",
        },
      });
      const body = await res.json();

      expect(body).toHaveProperty("data");
      expect(body.data).toHaveProperty("id");
    });

    it("should create a transaction in the database", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "USD",
        },
      });
      const body = await res.json();
      const transactionId = body.data.id;

      const transaction = await db.transaction.findOne({ id: transactionId });
      expect(transaction).toBeDefined();
      expect(transaction.amount).toBe(100);
      expect(transaction.currency).toBe("USD");
    });

    it("should automatically uppercase the currency", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "usd",
        },
      });
      const body = await res.json();
      const transactionId = body.data.id;

      const transaction = await db.transaction.findOne({ id: transactionId });
      expect(transaction.currency).toBe("USD");
    });

    it("should create a transaction event with type 'transaction_created'", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "USD",
        },
      });
      const body = await res.json();
      const transactionId = body.data.id;

      const transactionEvent = await db.transactionEvent.findOne({
        transactionId,
        eventType: "transaction_created",
      });

      expect(transactionEvent).toBeDefined();
    });

    it("should create an associated checkout page", async () => {
      const res = await client.payments.transactions.$post({});
      const body = await res.json();
      const transactionId = body.data.id;

      const [checkout] = await db.checkoutPage.findMany({ transactionId });

      expect(checkout).toBeDefined();
    });

    it("should have an associated API credential", async () => {
      const res = await client.payments.transactions.$post({});
      const body = await res.json();
      const transactionId = body.data.id;

      const transaction = await db.transaction.findOne({ id: transactionId });
      expect(transaction.apiCredential).toBeDefined();
    });

    it("should have an associated store", async () => {
      const res = await client.payments.transactions.$post({});
      const body = await res.json();
      const transactionId = body.data.id;

      const transaction = await db.transaction.findOne({ id: transactionId });
      expect(transaction.store).toBeDefined();
    });

    it("should return 400 if the amount is negative", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: -100,
          currency: "USD",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must be a positive number.");
    });

    it("should return 400 if the amount is more than 1,000,000€", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 1000001,
          currency: "EUR",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must not exceed 1,000,000€ or its equivalent in other currencies. Please contact support for larger transactions.");
    });

    it("should return 400 if the amount is more than the equivalent of 1,000,000€ in other currencies", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 1000000,
          currency: "KWD",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must not exceed 1,000,000€ or its equivalent in other currencies. Please contact support for larger transactions.");
    });

    it("should return 400 if the currency is not supported", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100,
          currency: "XYZ",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Unsupported currency.");
    });

    it("should return 400 if the amount decimal places exceed 2 for USD", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100.123,
          currency: "USD",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must have at most 2 decimal places for USD.");
    });

    it("should return 400 if the amount decimal places exceed 0 for JPY", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100.5,
          currency: "JPY",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must have no decimal places for JPY.");
    });

    it("should return 400 if the amount decimal places exceed 3 for KWD", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 100.1234,
          currency: "KWD",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must have at most 3 decimal places for KWD.");
    });

    it("should return 400 if the currency is BTC", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 0.001,
          currency: "BTC",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Cryptocurrency payments are not yet supported.");
    });

    it("should return 400 if the amount decimal places exceed 8 for BTC", async () => {
      const res = await client.payments.transactions.$post({
        body: {
          amount: 0.000000123,
          currency: "BTC",
        },
      });

      expect(res.status).toBe(400);
      const body = await res.json();
      expect(body).toHaveProperty("error");
      expect(body.error).toBe("Amount must have at most 8 decimal places for BTC.");
    });
  });
});

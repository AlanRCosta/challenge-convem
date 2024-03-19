import { randomUUID } from "crypto";
import fetch from "node-fetch";
import { describe, test } from "@jest/globals";

describe("Envio de transações", () => {
  test("enviar 100 transações", async () => {
    const testTransactions = () => {
      return new Array(100).fill(null).map(() => ({
        idempotencyId: randomUUID(),
        amount: Math.random() * 1000,
        type: Math.random() < 0.5 ? "debit" : "credit",
      }));
    };

    const url = "https://3j2a15f3bb.execute-api.us-east-2.amazonaws.com/Prod";
    const transactions = testTransactions();

    try {
      const promises = transactions.map(async (transaction) => {
        const response = await fetch(url, {
          method: "post",
          body: JSON.stringify(transaction),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(
            `Erro ao enviar transação: ${JSON.stringify(transaction)}`
          );
        }
        return response.json();
      });
      await Promise.all(promises);
      console.log("Todas as transações foram enviadas com sucesso.");
    } catch (error) {
      console.error("Erro ao enviar transações:", error);
    }
  });
});

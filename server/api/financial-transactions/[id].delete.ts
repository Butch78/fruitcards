import { financialTransactions } from "~/data/financial-transactions";

export default defineEventHandler((event) => {
  const id = getRouterParam(event, "id");

  const transactionIndex = financialTransactions.findIndex((t) => t.id === id);

  if (transactionIndex === -1) {
    throw createError({
      statusCode: 404,
      message: "Transaction not found",
    });
  }

  const deletedTransaction = financialTransactions.splice(transactionIndex, 1)[0];

  return { success: true, deleted: deletedTransaction };
});

import { financialTransactions, transactionCategories } from "~/data/financial-transactions";
import type { FinancialTransactionType, RecurringInterval } from "~/types";

interface UpdateTransactionBody {
  categoryId?: string | null;
  amount?: number;
  type?: FinancialTransactionType;
  description?: string | null;
  date?: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval | null;
  recurringEndDate?: string | null;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  const body = await readBody<UpdateTransactionBody>(event);

  const transactionIndex = financialTransactions.findIndex((t) => t.id === id);
  const existingTransaction = financialTransactions[transactionIndex];

  if (transactionIndex === -1 || !existingTransaction) {
    throw createError({
      statusCode: 404,
      message: "Transaction not found",
    });
  }

  // Update category reference if categoryId changed
  const category =
    body.categoryId !== undefined
      ? body.categoryId
        ? transactionCategories.find((c) => c.id === body.categoryId) || null
        : null
      : existingTransaction.category;

  const updatedTransaction = {
    ...existingTransaction,
    categoryId: body.categoryId !== undefined ? body.categoryId : existingTransaction.categoryId,
    category,
    amount: body.amount ?? existingTransaction.amount,
    type: body.type ?? existingTransaction.type,
    description: body.description !== undefined ? body.description : existingTransaction.description,
    date: body.date ? new Date(body.date) : existingTransaction.date,
    isRecurring: body.isRecurring ?? existingTransaction.isRecurring,
    recurringInterval:
      body.recurringInterval !== undefined
        ? body.recurringInterval
        : existingTransaction.recurringInterval,
    recurringEndDate:
      body.recurringEndDate !== undefined
        ? body.recurringEndDate
          ? new Date(body.recurringEndDate)
          : null
        : existingTransaction.recurringEndDate,
    updatedAt: new Date(),
  };

  financialTransactions[transactionIndex] = updatedTransaction;

  return updatedTransaction;
});

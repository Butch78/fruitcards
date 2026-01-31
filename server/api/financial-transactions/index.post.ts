import { nanoid } from "nanoid";
import { financialTransactions, transactionCategories } from "~/data/financial-transactions";
import type { FinancialTransaction, FinancialTransactionType, RecurringInterval } from "~/types";

interface CreateTransactionBody {
  categoryId?: string;
  amount: number;
  type: FinancialTransactionType;
  description?: string;
  date: string;
  isRecurring?: boolean;
  recurringInterval?: RecurringInterval;
  recurringEndDate?: string;
}

export default defineEventHandler(async (event) => {
  const body = await readBody<CreateTransactionBody>(event);

  if (!body.amount || !body.type || !body.date) {
    throw createError({
      statusCode: 400,
      message: "Missing required fields: amount, type, and date are required",
    });
  }

  const category = body.categoryId
    ? transactionCategories.find((c) => c.id === body.categoryId)
    : null;

  const newTransaction: FinancialTransaction = {
    id: `txn-${nanoid()}`,
    userId: "user-1", // TODO: get from auth session
    categoryId: body.categoryId || null,
    category: category || null,
    amount: body.amount,
    type: body.type,
    description: body.description || null,
    date: new Date(body.date),
    isRecurring: body.isRecurring || false,
    recurringInterval: body.recurringInterval || null,
    recurringEndDate: body.recurringEndDate ? new Date(body.recurringEndDate) : null,
    parentTransactionId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Add to in-memory array (in production, this would be a database insert)
  financialTransactions.unshift(newTransaction);

  return newTransaction;
});

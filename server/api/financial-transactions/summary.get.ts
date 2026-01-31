import { financialTransactions, transactionCategories } from "~/data/financial-transactions";
import type { TransactionSummary } from "~/types";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  let transactions = [...financialTransactions];

  // Filter by date range if provided
  if (query.startDate && typeof query.startDate === "string") {
    const startDate = new Date(query.startDate);
    transactions = transactions.filter((t) => new Date(t.date) >= startDate);
  }
  if (query.endDate && typeof query.endDate === "string") {
    const endDate = new Date(query.endDate);
    transactions = transactions.filter((t) => new Date(t.date) <= endDate);
  }

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryTotals = new Map<string, number>();
  transactions.forEach((t) => {
    if (t.categoryId) {
      const current = categoryTotals.get(t.categoryId) || 0;
      categoryTotals.set(t.categoryId, current + t.amount);
    }
  });

  const byCategory = Array.from(categoryTotals.entries()).map(([categoryId, total]) => {
    const category = transactionCategories.find((c) => c.id === categoryId);
    return {
      categoryId,
      categoryName: category?.name || "Unknown",
      categoryColor: category?.color || null,
      total,
      type: category?.type || "expense",
    };
  });

  // Group by month
  const monthTotals = new Map<string, { income: number; expenses: number }>();
  transactions.forEach((t) => {
    const monthKey = new Date(t.date).toISOString().slice(0, 7); // YYYY-MM
    const current = monthTotals.get(monthKey) || { income: 0, expenses: 0 };
    if (t.type === "income") {
      current.income += t.amount;
    } else {
      current.expenses += t.amount;
    }
    monthTotals.set(monthKey, current);
  });

  const byMonth = Array.from(monthTotals.entries())
    .map(([month, totals]) => ({
      month,
      income: totals.income,
      expenses: totals.expenses,
    }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const summary: TransactionSummary = {
    totalIncome,
    totalExpenses,
    netBalance: totalIncome - totalExpenses,
    transactionCount: transactions.length,
    byCategory,
    byMonth,
  };

  return summary;
});

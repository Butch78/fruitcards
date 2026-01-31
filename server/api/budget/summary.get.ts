import { getBudgetSummary } from "~/data/budget";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  const monthlyIncome = query.income ? Number(query.income) : 5200;

  return getBudgetSummary(monthlyIncome);
});

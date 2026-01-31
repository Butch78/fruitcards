import { getPlanningSummary, defaultProfile } from "~/data/planning";

export default defineEventHandler((event) => {
  const query = getQuery(event);

  // Allow overriding profile values via query params
  const profile = {
    ...defaultProfile,
    annualSalary: query.salary ? Number(query.salary) : defaultProfile.annualSalary,
    canton: (query.canton as typeof defaultProfile.canton) || defaultProfile.canton,
    monthlyExpenses: query.expenses ? Number(query.expenses) : defaultProfile.monthlyExpenses,
    savingsRate: query.savingsRate ? Number(query.savingsRate) : defaultProfile.savingsRate,
    pillar3aContribution: query.pillar3a ? Number(query.pillar3a) : defaultProfile.pillar3aContribution,
  };

  const currentAge = query.age ? Number(query.age) : 30;
  const currentPortfolioValue = query.portfolio ? Number(query.portfolio) : 50000;

  return getPlanningSummary(profile, currentAge, currentPortfolioValue);
});

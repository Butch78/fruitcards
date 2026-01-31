import type {
  UserFinancialProfile,
  SwissTaxEstimate,
  TaxOptimizationTip,
  FinancialProjection,
  PlanningGoal,
  PlanningSummary,
} from "~/types";

// Default profile for an Australian expat in Switzerland
export const defaultProfile: UserFinancialProfile = {
  annualSalary: 80000,
  currency: "CHF",
  canton: "ZH", // Zurich - common for expats
  taxClass: "single",
  hasChildren: false,
  numberOfChildren: 0,
  residencyStatus: "permit_b",
  originCountry: "Australia",
  pillar2Contribution: 6800, // ~8.5% of salary for age 25-34
  pillar3aContribution: 7056, // Max for 2025 with Pillar 2
  monthlyExpenses: 4500,
  savingsRate: 25,
};

// Swiss tax estimates (simplified calculation for Zurich)
export function calculateSwissTax(profile: UserFinancialProfile): SwissTaxEstimate {
  const salary = profile.annualSalary;

  // Deductions
  const pillar2Deduction = profile.pillar2Contribution;
  const pillar3aDeduction = Math.min(profile.pillar3aContribution, 7056); // 2025 max
  const standardDeduction = 2600; // Berufsauslagen
  const insuranceDeduction = 2700; // Health/accident insurance estimate
  const commutingDeduction = 3200; // Max public transport deduction

  const totalDeductions = pillar2Deduction + pillar3aDeduction + standardDeduction + insuranceDeduction + commutingDeduction;
  const taxableIncome = Math.max(0, salary - totalDeductions);

  // Simplified progressive tax calculation for Zurich
  // Federal tax (~11.5% max)
  const federalTax = taxableIncome * 0.085;

  // Cantonal tax (Zurich ~13%)
  const cantonalTax = taxableIncome * 0.10;

  // Communal tax (~119% of cantonal in Zurich city)
  const communalTax = cantonalTax * 0.90;

  // Church tax (optional, ~10% of cantonal if applicable)
  const churchTax = 0; // Assume opted out

  const totalTax = federalTax + cantonalTax + communalTax + churchTax;
  const effectiveTaxRate = salary > 0 ? (totalTax / salary) * 100 : 0;

  // Wealth tax (very low in Switzerland, ~0.1-0.3% of net wealth)
  // Assuming 50,000 CHF in assets
  const wealthTax = 50000 * 0.002;

  // Swiss withholding tax on dividends (35% Verrechnungssteuer)
  // Assuming 2000 CHF in dividends received
  const dividendIncome = 2000;
  const withholdingTaxOnDividends = dividendIncome * 0.35;
  // This is fully reclaimable for Swiss tax residents!
  const reclaimableWithholdingTax = withholdingTaxOnDividends;

  return {
    federalTax: Math.round(federalTax),
    cantonalTax: Math.round(cantonalTax),
    communalTax: Math.round(communalTax),
    churchTax: Math.round(churchTax),
    totalTax: Math.round(totalTax),
    effectiveTaxRate: Math.round(effectiveTaxRate * 10) / 10,
    wealthTax: Math.round(wealthTax),
    withholdingTaxOnDividends: Math.round(withholdingTaxOnDividends),
    reclaimableWithholdingTax: Math.round(reclaimableWithholdingTax),
  };
}

// Tax optimization tips for expats in Switzerland
export const taxOptimizationTips: TaxOptimizationTip[] = [
  {
    id: "tip-1",
    title: "Maximize Pillar 3a Contributions",
    description: "Contribute the maximum CHF 7,056 (2025) to your Pillar 3a. This is fully tax-deductible and reduces your taxable income. Consider opening multiple 3a accounts to optimize withdrawal taxation later.",
    potentialSavings: 2100,
    category: "pillar3a",
    priority: "high",
    applicable: true,
  },
  {
    id: "tip-2",
    title: "Claim Verrechnungssteuer Refund",
    description: "The 35% withholding tax on Swiss dividends is fully refundable for tax residents. Make sure to declare all dividends and claim the refund in your tax return. Many expats miss this!",
    potentialSavings: 700,
    category: "dividends",
    priority: "high",
    applicable: true,
  },
  {
    id: "tip-3",
    title: "Voluntary Pillar 2 Buy-ins",
    description: "If you have gaps in your Pillar 2 (pension fund), you can make voluntary contributions that are fully tax-deductible. Check your pension certificate for your 'buy-in potential'.",
    potentialSavings: null,
    category: "deductions",
    priority: "medium",
    applicable: true,
  },
  {
    id: "tip-4",
    title: "Declare All Deductions",
    description: "Don't forget to claim: work-related expenses (up to CHF 3,200 for commuting), health insurance premiums, professional training costs, and home office deductions if applicable.",
    potentialSavings: 1500,
    category: "deductions",
    priority: "high",
    applicable: true,
  },
  {
    id: "tip-5",
    title: "Wealth Tax Planning",
    description: "Switzerland taxes wealth, not capital gains on personal investments. Keep detailed records of your assets. Consider timing large purchases before Dec 31 to reduce wealth tax base.",
    potentialSavings: 200,
    category: "wealth",
    priority: "low",
    applicable: true,
  },
  {
    id: "tip-6",
    title: "No Capital Gains Tax (Private)",
    description: "Great news! Switzerland doesn't tax capital gains on private investments. Your stock/ETF profits are tax-free. However, dividends are still taxed as income.",
    potentialSavings: null,
    category: "wealth",
    priority: "medium",
    applicable: true,
  },
  {
    id: "tip-7",
    title: "Australian Tax Obligations",
    description: "As an Australian citizen abroad, ensure you've properly established non-residency with the ATO. You may still have reporting obligations. Consider consulting a cross-border tax specialist.",
    potentialSavings: null,
    category: "expat",
    priority: "high",
    applicable: true,
  },
  {
    id: "tip-8",
    title: "Double Taxation Agreement",
    description: "Australia and Switzerland have a DTA. This prevents double taxation on income. Ensure your employer is applying the correct treaty benefits for any Australian-sourced income.",
    potentialSavings: null,
    category: "expat",
    priority: "medium",
    applicable: true,
  },
  {
    id: "tip-9",
    title: "Consider Canton Move for Tax",
    description: "Tax rates vary significantly by canton. Zug and Schwyz have much lower rates than Zurich or Geneva. If you're flexible, this could save thousands annually.",
    potentialSavings: 5000,
    category: "deductions",
    priority: "low",
    applicable: true,
  },
  {
    id: "tip-10",
    title: "Exit Church Tax",
    description: "If you're registered with a church (often happens automatically), you can save ~8-10% of your cantonal tax by formally leaving. This is a straightforward administrative process.",
    potentialSavings: 800,
    category: "deductions",
    priority: "medium",
    applicable: true,
  },
];

// Generate financial projections
export function generateProjections(
  profile: UserFinancialProfile,
  currentAge: number,
  currentPortfolioValue: number,
  yearsToProject: number = 30
): FinancialProjection[] {
  const projections: FinancialProjection[] = [];

  let portfolioValue = currentPortfolioValue;
  let pillar2Value = 50000; // Starting estimate
  let pillar3aValue = 20000; // Starting estimate
  let totalSavings = 10000; // Cash savings

  const annualReturn = 0.07; // 7% average market return
  const salaryGrowth = 0.02; // 2% annual salary increase
  const pillar2Return = 0.02; // Conservative pension return

  let salary = profile.annualSalary;

  for (let i = 0; i <= yearsToProject; i++) {
    const year = new Date().getFullYear() + i;
    const age = currentAge + i;

    // Calculate annual savings
    const monthlySavings = (salary / 12) * (profile.savingsRate / 100);
    const annualSavings = monthlySavings * 12 - profile.pillar3aContribution;

    // Estimate tax
    const tempProfile = { ...profile, annualSalary: salary };
    const tax = calculateSwissTax(tempProfile);

    // Update values
    portfolioValue = portfolioValue * (1 + annualReturn) + annualSavings * 0.7; // 70% to investments
    totalSavings = totalSavings * 1.01 + annualSavings * 0.3; // 30% to savings, 1% interest

    // Pillar 2 grows with contributions and returns
    const pillar2Contribution = salary * 0.085 * 2; // Employee + employer
    pillar2Value = pillar2Value * (1 + pillar2Return) + pillar2Contribution;

    // Pillar 3a
    pillar3aValue = pillar3aValue * (1 + annualReturn) + profile.pillar3aContribution;

    const netWorth = portfolioValue + totalSavings + pillar2Value + pillar3aValue;

    projections.push({
      year,
      age,
      salary: Math.round(salary),
      portfolioValue: Math.round(portfolioValue),
      totalSavings: Math.round(totalSavings),
      pillar2Value: Math.round(pillar2Value),
      pillar3aValue: Math.round(pillar3aValue),
      netWorth: Math.round(netWorth),
      annualTax: tax.totalTax,
    });

    // Increase salary for next year
    salary = salary * (1 + salaryGrowth);
  }

  return projections;
}

// Sample goals
export const planningGoals: PlanningGoal[] = [
  {
    id: "goal-1",
    name: "Emergency Fund",
    targetAmount: 30000,
    currentAmount: 15000,
    targetDate: new Date("2025-12-31"),
    category: "emergency",
    priority: 1,
  },
  {
    id: "goal-2",
    name: "House Deposit",
    targetAmount: 200000,
    currentAmount: 45000,
    targetDate: new Date("2030-01-01"),
    category: "house",
    priority: 2,
  },
  {
    id: "goal-3",
    name: "Early Retirement (FIRE)",
    targetAmount: 1500000,
    currentAmount: 95000,
    targetDate: new Date("2045-01-01"),
    category: "retirement",
    priority: 3,
  },
];

// Calculate FIRE number (25x annual expenses)
export function calculateFireNumber(monthlyExpenses: number): number {
  return monthlyExpenses * 12 * 25;
}

// Calculate years to FIRE
export function calculateYearsToFire(
  currentNetWorth: number,
  annualSavings: number,
  fireNumber: number,
  annualReturn: number = 0.07
): number {
  if (currentNetWorth >= fireNumber) return 0;
  if (annualSavings <= 0) return Infinity;

  // Using compound interest formula
  let years = 0;
  let value = currentNetWorth;

  while (value < fireNumber && years < 100) {
    value = value * (1 + annualReturn) + annualSavings;
    years++;
  }

  return years;
}

// Get complete planning summary
export function getPlanningSummary(
  profile: UserFinancialProfile = defaultProfile,
  currentAge: number = 30,
  currentPortfolioValue: number = 50000
): PlanningSummary {
  const taxEstimate = calculateSwissTax(profile);

  const monthlyGross = profile.annualSalary / 12;
  const monthlyTax = taxEstimate.totalTax / 12;
  const monthlyNetIncome = monthlyGross - monthlyTax - (profile.pillar2Contribution / 12);
  const monthlySavings = monthlyNetIncome - profile.monthlyExpenses;

  const projections = generateProjections(profile, currentAge, currentPortfolioValue, 30);
  const currentNetWorth = projections[0]?.netWorth || 0;

  const fireNumber = calculateFireNumber(profile.monthlyExpenses);
  const annualSavings = monthlySavings * 12;
  const yearsToFire = calculateYearsToFire(currentNetWorth, annualSavings, fireNumber);

  return {
    profile,
    taxEstimate,
    optimizationTips: taxOptimizationTips.filter((t) => t.applicable),
    projections,
    goals: planningGoals,
    monthlyNetIncome: Math.round(monthlyNetIncome),
    monthlySavings: Math.round(monthlySavings),
    fireNumber,
    yearsToFire,
  };
}

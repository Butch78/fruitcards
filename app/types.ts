export interface Notification {
  id: number
  unread?: boolean
  sender: unknown
  body: string
  date: string
}

export type TransactionStatus = "Active" | "Inactive" | "Pending" | "Refunded"

export interface TransactionContact {
  name: string
  avatar: string
  email: string
}

export interface Transaction {
  company: string
  description: string
  date?: string
  domain: string
  location: string
  contact: TransactionContact
  status: TransactionStatus
}

// Financial transaction types (matches database schema)
export type FinancialTransactionType = "income" | "expense"
export type RecurringInterval = "daily" | "weekly" | "monthly" | "yearly"

export interface TransactionCategory {
  id: string
  userId: string
  name: string
  icon?: string | null
  color?: string | null
  type: FinancialTransactionType
  createdAt: Date
}

export interface FinancialTransaction {
  id: string
  userId: string
  categoryId?: string | null
  category?: TransactionCategory | null
  amount: number
  type: FinancialTransactionType
  description?: string | null
  date: Date
  isRecurring: boolean
  recurringInterval?: RecurringInterval | null
  recurringEndDate?: Date | null
  parentTransactionId?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface TransactionSummary {
  totalIncome: number
  totalExpenses: number
  netBalance: number
  transactionCount: number
  byCategory: {
    categoryId: string
    categoryName: string
    categoryColor: string | null
    total: number
    type: FinancialTransactionType
  }[]
  byMonth: {
    month: string
    income: number
    expenses: number
  }[]
}

// Portfolio types
export type AssetType = "stock" | "etf" | "crypto" | "bond" | "cash" | "other"

export interface PortfolioHolding {
  id: string
  userId: string
  symbol: string
  name: string
  assetType: AssetType
  quantity: number
  averageCost: number
  currentPrice: number
  currency: string
  sector?: string | null
  exchange?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface PortfolioTransaction {
  id: string
  holdingId: string
  type: "buy" | "sell" | "dividend"
  quantity: number
  price: number
  fees: number
  date: Date
  notes?: string | null
  createdAt: Date
}

export interface PortfolioSummary {
  totalValue: number
  totalCost: number
  totalGain: number
  totalGainPercent: number
  dayChange: number
  dayChangePercent: number
  holdingsCount: number
  byAssetType: {
    assetType: AssetType
    value: number
    percentage: number
    color: string
  }[]
  bySector: {
    sector: string
    value: number
    percentage: number
  }[]
  topGainers: {
    symbol: string
    name: string
    gainPercent: number
  }[]
  topLosers: {
    symbol: string
    name: string
    gainPercent: number
  }[]
}

// Swiss Financial Planning Types
export type SwissCanton =
  | "ZH" | "BE" | "LU" | "UR" | "SZ" | "OW" | "NW" | "GL" | "ZG" | "FR"
  | "SO" | "BS" | "BL" | "SH" | "AR" | "AI" | "SG" | "GR" | "AG" | "TG"
  | "TI" | "VD" | "VS" | "NE" | "GE" | "JU"

export interface UserFinancialProfile {
  annualSalary: number
  currency: "CHF" | "EUR" | "USD" | "AUD"
  canton: SwissCanton
  taxClass: "single" | "married" | "married_dual_income"
  hasChildren: boolean
  numberOfChildren: number
  residencyStatus: "permit_b" | "permit_c" | "swiss_citizen"
  originCountry: string
  pillar2Contribution: number
  pillar3aContribution: number
  monthlyExpenses: number
  savingsRate: number
}

export interface SwissTaxEstimate {
  federalTax: number
  cantonalTax: number
  communalTax: number
  churchTax: number
  totalTax: number
  effectiveTaxRate: number
  wealthTax: number
  withholdingTaxOnDividends: number
  reclaimableWithholdingTax: number
}

export interface TaxOptimizationTip {
  id: string
  title: string
  description: string
  potentialSavings: number | null
  category: "pillar3a" | "deductions" | "wealth" | "dividends" | "expat"
  priority: "high" | "medium" | "low"
  applicable: boolean
}

export interface FinancialProjection {
  year: number
  age: number
  salary: number
  portfolioValue: number
  totalSavings: number
  pillar2Value: number
  pillar3aValue: number
  netWorth: number
  annualTax: number
}

export interface PlanningGoal {
  id: string
  name: string
  targetAmount: number
  currentAmount: number
  targetDate: Date
  category: "retirement" | "house" | "education" | "emergency" | "other"
  priority: number
}

export interface PlanningSummary {
  profile: UserFinancialProfile
  taxEstimate: SwissTaxEstimate
  optimizationTips: TaxOptimizationTip[]
  projections: FinancialProjection[]
  goals: PlanningGoal[]
  monthlyNetIncome: number
  monthlySavings: number
  fireNumber: number
  yearsToFire: number
}

// Budget Types
export type BudgetCategoryType =
  | "housing"
  | "utilities"
  | "groceries"
  | "transport"
  | "health"
  | "insurance"
  | "entertainment"
  | "dining"
  | "shopping"
  | "subscriptions"
  | "savings"
  | "other"

export interface BudgetCategory {
  id: string
  name: string
  type: BudgetCategoryType
  icon: string
  color: string
  budgeted: number
  spent: number
  isFixed: boolean
  notes?: string | null
}

export interface BudgetItem {
  id: string
  categoryId: string
  name: string
  amount: number
  isRecurring: boolean
  dueDate?: number | null // Day of month (1-31)
  isPaid: boolean
  notes?: string | null
}

export interface BudgetSummary {
  monthlyIncome: number
  totalBudgeted: number
  totalSpent: number
  totalRemaining: number
  savingsTarget: number
  actualSavings: number
  categories: BudgetCategory[]
  items: BudgetItem[]
  fixedExpenses: number
  variableExpenses: number
}

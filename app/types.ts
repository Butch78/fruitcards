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

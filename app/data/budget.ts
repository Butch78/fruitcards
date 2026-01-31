import type { BudgetCategory, BudgetItem, BudgetSummary, BudgetCategoryType } from "~/types";

// Category configuration with icons and colors
export const categoryConfig: Record<BudgetCategoryType, { icon: string; color: string; label: string }> = {
  housing: { icon: "i-lucide-home", color: "#ef4444", label: "Housing" },
  utilities: { icon: "i-lucide-zap", color: "#f97316", label: "Utilities" },
  groceries: { icon: "i-lucide-shopping-cart", color: "#22c55e", label: "Groceries" },
  transport: { icon: "i-lucide-car", color: "#3b82f6", label: "Transport" },
  health: { icon: "i-lucide-heart-pulse", color: "#ec4899", label: "Health" },
  insurance: { icon: "i-lucide-shield", color: "#8b5cf6", label: "Insurance" },
  entertainment: { icon: "i-lucide-gamepad-2", color: "#06b6d4", label: "Entertainment" },
  dining: { icon: "i-lucide-utensils", color: "#f59e0b", label: "Dining Out" },
  shopping: { icon: "i-lucide-shopping-bag", color: "#a855f7", label: "Shopping" },
  subscriptions: { icon: "i-lucide-repeat", color: "#6366f1", label: "Subscriptions" },
  savings: { icon: "i-lucide-piggy-bank", color: "#10b981", label: "Savings" },
  other: { icon: "i-lucide-more-horizontal", color: "#6b7280", label: "Other" },
};

// Typical Swiss expense templates
export const typicalSwissExpenses: { category: BudgetCategoryType; name: string; amount: number; isFixed: boolean }[] = [
  // Housing
  { category: "housing", name: "Rent", amount: 1000, isFixed: true },
  { category: "housing", name: "Nebenkosten (Utilities deposit)", amount: 150, isFixed: true },

  // Utilities
  { category: "utilities", name: "Electricity (EWZ/local)", amount: 60, isFixed: false },
  { category: "utilities", name: "Internet (Swisscom/Salt/Sunrise)", amount: 50, isFixed: true },
  { category: "utilities", name: "Mobile Phone", amount: 40, isFixed: true },
  { category: "utilities", name: "Serafe (TV/Radio tax)", amount: 28, isFixed: true },

  // Insurance (mandatory in Switzerland!)
  { category: "insurance", name: "Health Insurance (KVG)", amount: 350, isFixed: true },
  { category: "insurance", name: "Household Insurance", amount: 25, isFixed: true },
  { category: "insurance", name: "Personal Liability", amount: 15, isFixed: true },

  // Transport
  { category: "transport", name: "GA/Halbtax (Public Transport)", amount: 200, isFixed: true },
  { category: "transport", name: "Car Insurance/Lease", amount: 0, isFixed: true },
  { category: "transport", name: "Fuel/Charging", amount: 0, isFixed: false },

  // Groceries
  { category: "groceries", name: "Groceries (Migros/Coop)", amount: 500, isFixed: false },
  { category: "groceries", name: "Household Items", amount: 50, isFixed: false },

  // Health
  { category: "health", name: "Gym Membership", amount: 80, isFixed: true },
  { category: "health", name: "Pharmacy/Medical", amount: 50, isFixed: false },
  { category: "health", name: "Franchise Reserve", amount: 25, isFixed: false },

  // Entertainment
  { category: "entertainment", name: "Hobbies/Activities", amount: 100, isFixed: false },
  { category: "entertainment", name: "Events/Concerts", amount: 50, isFixed: false },

  // Dining
  { category: "dining", name: "Restaurants/Cafes", amount: 200, isFixed: false },
  { category: "dining", name: "Work Lunches", amount: 150, isFixed: false },
  { category: "dining", name: "Coffee/Snacks", amount: 50, isFixed: false },

  // Subscriptions
  { category: "subscriptions", name: "Netflix", amount: 17, isFixed: true },
  { category: "subscriptions", name: "Spotify", amount: 13, isFixed: true },
  { category: "subscriptions", name: "Cloud Storage", amount: 10, isFixed: true },
  { category: "subscriptions", name: "Other Apps", amount: 20, isFixed: true },

  // Shopping
  { category: "shopping", name: "Clothing", amount: 100, isFixed: false },
  { category: "shopping", name: "Electronics/Gadgets", amount: 50, isFixed: false },

  // Savings
  { category: "savings", name: "Pillar 3a", amount: 588, isFixed: true }, // 7056/12
  { category: "savings", name: "Emergency Fund", amount: 200, isFixed: false },
  { category: "savings", name: "Investment Contributions", amount: 300, isFixed: false },

  // Other
  { category: "other", name: "Haircuts/Personal Care", amount: 50, isFixed: false },
  { category: "other", name: "Gifts", amount: 50, isFixed: false },
  { category: "other", name: "Miscellaneous", amount: 100, isFixed: false },
];

// Default budget categories
export const defaultBudgetCategories: BudgetCategory[] = [
  {
    id: "cat-housing",
    name: "Housing",
    type: "housing",
    icon: categoryConfig.housing.icon,
    color: categoryConfig.housing.color,
    budgeted: 1150,
    spent: 1150,
    isFixed: true,
    notes: "Rent + Nebenkosten",
  },
  {
    id: "cat-utilities",
    name: "Utilities",
    type: "utilities",
    icon: categoryConfig.utilities.icon,
    color: categoryConfig.utilities.color,
    budgeted: 178,
    spent: 165,
    isFixed: true,
    notes: "Electricity, Internet, Mobile, Serafe",
  },
  {
    id: "cat-insurance",
    name: "Insurance",
    type: "insurance",
    icon: categoryConfig.insurance.icon,
    color: categoryConfig.insurance.color,
    budgeted: 390,
    spent: 390,
    isFixed: true,
    notes: "Health insurance is mandatory in Switzerland!",
  },
  {
    id: "cat-transport",
    name: "Transport",
    type: "transport",
    icon: categoryConfig.transport.icon,
    color: categoryConfig.transport.color,
    budgeted: 200,
    spent: 200,
    isFixed: true,
    notes: "Halbtax or GA Travelcard",
  },
  {
    id: "cat-groceries",
    name: "Groceries",
    type: "groceries",
    icon: categoryConfig.groceries.icon,
    color: categoryConfig.groceries.color,
    budgeted: 550,
    spent: 480,
    isFixed: false,
    notes: null,
  },
  {
    id: "cat-health",
    name: "Health",
    type: "health",
    icon: categoryConfig.health.icon,
    color: categoryConfig.health.color,
    budgeted: 155,
    spent: 130,
    isFixed: false,
    notes: "Gym + medical expenses",
  },
  {
    id: "cat-dining",
    name: "Dining Out",
    type: "dining",
    icon: categoryConfig.dining.icon,
    color: categoryConfig.dining.color,
    budgeted: 400,
    spent: 320,
    isFixed: false,
    notes: null,
  },
  {
    id: "cat-entertainment",
    name: "Entertainment",
    type: "entertainment",
    icon: categoryConfig.entertainment.icon,
    color: categoryConfig.entertainment.color,
    budgeted: 150,
    spent: 85,
    isFixed: false,
    notes: null,
  },
  {
    id: "cat-subscriptions",
    name: "Subscriptions",
    type: "subscriptions",
    icon: categoryConfig.subscriptions.icon,
    color: categoryConfig.subscriptions.color,
    budgeted: 60,
    spent: 60,
    isFixed: true,
    notes: "Netflix, Spotify, etc.",
  },
  {
    id: "cat-shopping",
    name: "Shopping",
    type: "shopping",
    icon: categoryConfig.shopping.icon,
    color: categoryConfig.shopping.color,
    budgeted: 150,
    spent: 75,
    isFixed: false,
    notes: null,
  },
  {
    id: "cat-savings",
    name: "Savings",
    type: "savings",
    icon: categoryConfig.savings.icon,
    color: categoryConfig.savings.color,
    budgeted: 1088,
    spent: 1088,
    isFixed: true,
    notes: "Pillar 3a + investments",
  },
  {
    id: "cat-other",
    name: "Other",
    type: "other",
    icon: categoryConfig.other.icon,
    color: categoryConfig.other.color,
    budgeted: 200,
    spent: 120,
    isFixed: false,
    notes: null,
  },
];

// Default budget items
export const defaultBudgetItems: BudgetItem[] = [
  // Housing
  { id: "item-1", categoryId: "cat-housing", name: "Rent", amount: 1000, isRecurring: true, dueDate: 1, isPaid: true, notes: null },
  { id: "item-2", categoryId: "cat-housing", name: "Nebenkosten", amount: 150, isRecurring: true, dueDate: 1, isPaid: true, notes: null },

  // Utilities
  { id: "item-3", categoryId: "cat-utilities", name: "Electricity", amount: 60, isRecurring: true, dueDate: 15, isPaid: true, notes: null },
  { id: "item-4", categoryId: "cat-utilities", name: "Internet", amount: 50, isRecurring: true, dueDate: 20, isPaid: true, notes: "Swisscom" },
  { id: "item-5", categoryId: "cat-utilities", name: "Mobile Phone", amount: 40, isRecurring: true, dueDate: 20, isPaid: true, notes: "Salt" },
  { id: "item-6", categoryId: "cat-utilities", name: "Serafe", amount: 28, isRecurring: true, dueDate: 1, isPaid: false, notes: "Quarterly" },

  // Insurance
  { id: "item-7", categoryId: "cat-insurance", name: "Health Insurance", amount: 350, isRecurring: true, dueDate: 1, isPaid: true, notes: "CSS/Helsana" },
  { id: "item-8", categoryId: "cat-insurance", name: "Household + Liability", amount: 40, isRecurring: true, dueDate: 1, isPaid: true, notes: null },

  // Transport
  { id: "item-9", categoryId: "cat-transport", name: "Halbtax Annual", amount: 200, isRecurring: true, dueDate: null, isPaid: true, notes: "Monthly portion" },

  // Subscriptions
  { id: "item-10", categoryId: "cat-subscriptions", name: "Netflix", amount: 17, isRecurring: true, dueDate: 5, isPaid: true, notes: null },
  { id: "item-11", categoryId: "cat-subscriptions", name: "Spotify", amount: 13, isRecurring: true, dueDate: 10, isPaid: true, notes: null },
  { id: "item-12", categoryId: "cat-subscriptions", name: "iCloud", amount: 10, isRecurring: true, dueDate: 15, isPaid: true, notes: null },
  { id: "item-13", categoryId: "cat-subscriptions", name: "Other Apps", amount: 20, isRecurring: true, dueDate: null, isPaid: true, notes: null },

  // Savings
  { id: "item-14", categoryId: "cat-savings", name: "Pillar 3a", amount: 588, isRecurring: true, dueDate: 25, isPaid: true, notes: "Monthly contribution" },
  { id: "item-15", categoryId: "cat-savings", name: "Investment Account", amount: 300, isRecurring: true, dueDate: 26, isPaid: true, notes: "ETF purchases" },
  { id: "item-16", categoryId: "cat-savings", name: "Emergency Fund", amount: 200, isRecurring: true, dueDate: 26, isPaid: true, notes: null },
];

// Get budget summary
export function getBudgetSummary(
  monthlyIncome: number = 5200, // Net income after tax and Pillar 2
  categories: BudgetCategory[] = defaultBudgetCategories,
  items: BudgetItem[] = defaultBudgetItems
): BudgetSummary {
  const totalBudgeted = categories.reduce((sum, c) => sum + c.budgeted, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const fixedExpenses = categories.filter((c) => c.isFixed).reduce((sum, c) => sum + c.budgeted, 0);
  const variableExpenses = categories.filter((c) => !c.isFixed).reduce((sum, c) => sum + c.budgeted, 0);

  const savingsCategory = categories.find((c) => c.type === "savings");
  const savingsTarget = savingsCategory?.budgeted || 0;
  const actualSavings = savingsCategory?.spent || 0;

  return {
    monthlyIncome,
    totalBudgeted,
    totalSpent,
    totalRemaining: monthlyIncome - totalSpent,
    savingsTarget,
    actualSavings,
    categories,
    items,
    fixedExpenses,
    variableExpenses,
  };
}

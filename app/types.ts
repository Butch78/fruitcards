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

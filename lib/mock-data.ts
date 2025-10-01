import type { User } from "./features/auth/authSlice"

export const mockUsers: User[] = [
  {
    id: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    name: "Hammad Shahbaz | Codingcops",
    email: "hammad.shahbaz@codingcops.org",
    picture: null,
    sub: "hammad.shahbaz@codingcops.org",
    is_active: true,
    created_at: "2025-09-02T12:49:07.607169Z",
    updated_at: "2025-09-24T08:36:01.162844Z",
    role_id: "role_e46e16",
    role: {
      id: "role_e46e16",
      name: "Super Admin",
      type: "super_admin",
      description: "super_admin role",
      is_active: true,
    },
  },
  {
    id: "ee6b8yd7-7054-405b-b67f-4f335f5398nm",
    name: "Sohail Shahid | Codingcops",
    email: "sohail.shahid@codingcops.org",
    picture: null,
    sub: "sohail.shahid@codingcops.org",
    is_active: true,
    created_at: "2025-10-02T12:49:07.607169Z",
    updated_at: "2025-10-24T08:36:01.162844Z",
    role_id: "role_e46e16",
    role: {
      id: "role_e46e16",
      name: "Super Admin",
      type: "super_admin",
      description: "super_admin role",
      is_active: true,
    },
  },
]

export interface Transaction {
  id: string
  userId: string
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
  createdAt: string
  picture?: string | null 
}

export const mockTransactions: Transaction[] = [
  {
    id: "txn_001",
    userId: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    type: "income",
    amount: 5000,
    description: "Monthly Salary",
    category: "Salary",
    date: "2025-01-01",
    createdAt: "2025-01-01T10:00:00Z",
    picture: "https://cdn-icons-png.flaticon.com/512/3135/3135673.png",
  },
  {
    id: "txn_002",
    userId: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    type: "expense",
    amount: 1200,
    description: "Rent Payment",
    category: "Housing",
    date: "2025-01-01",
    createdAt: "2025-01-01T14:00:00Z",
    picture: "https://cdn-icons-png.flaticon.com/512/3104/3104004.png"
  },
  {
    id: "txn_003",
    userId: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    type: "expense",
    amount: 300,
    description: "Groceries",
    category: "Food",
    date: "2025-01-02",
    createdAt: "2025-01-02T16:00:00Z",
    picture: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",

  },
  {
    id: "txn_004",
    userId: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    type: "income",
    amount: 500,
    description: "Freelance Project",
    category: "Freelance",
    date: "2025-01-03",
    createdAt: "2025-01-03T12:00:00Z",
    picture: "https://cdn-icons-png.flaticon.com/512/942/942748.png",

  },
  {
    id: "txn_005",
    userId: "ee6bd7d7-7054-405b-b67f-4f335f5386cd",
    type: "expense",
    amount: 150,
    description: "Utilities Bill",
    category: "Utilities",
    date: "2025-01-05",
    createdAt: "2025-01-05T09:00:00Z",
    picture: "https://cdn-icons-png.flaticon.com/512/2920/2920322.png",

  },
]

const users = [...mockUsers]
const transactions = [...mockTransactions]

export const mockDatabase = {
  users: {
    findByEmail: (email: string) => users.find((user) => user.email === email),
    findById: (id: string) => users.find((user) => user.id === id),
  },
  transactions: {
    findByUserId: (userId: string) => transactions.filter((txn) => txn.userId === userId),
    create: (transaction: Omit<Transaction, "id" | "createdAt"> & { picture?: string | null }) => {
      const newTransaction: Transaction = {
        ...transaction,
        id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      }
      transactions.push(newTransaction)
      return newTransaction
    },
    update: (id: string, updates: Partial<Transaction>) => {
      const index = transactions.findIndex((txn) => txn.id === id)
      if (index !== -1) {
        transactions[index] = { ...transactions[index], ...updates }
        return transactions[index]
      }
      return null
    },
    delete: (id: string) => {
      const index = transactions.findIndex((txn) => txn.id === id)
      if (index !== -1) {
        const deleted = transactions[index]
        transactions.splice(index, 1)
        return deleted
      }
      return null
    },
  },
}

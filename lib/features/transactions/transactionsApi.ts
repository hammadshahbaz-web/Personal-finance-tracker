import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { RootState } from "@/lib/store"
import type { Transaction } from "@/lib/mock-data"

export interface CreateTransactionRequest {
  type: "income" | "expense"
  amount: number
  description: string
  category: string
  date: string
}

export interface TransactionsResponse {
  success: boolean
  data: Transaction[]
}

export interface TransactionResponse {
  success: boolean
  data: Transaction
}

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
    prepareHeaders: (headers, { getState }) => {
      // Add auth token to requests
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set("authorization", `Bearer ${token}`)
      }
      return headers
    },
  }),
  tagTypes: ["Transaction"],
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsResponse, void>({
      query: () => "/transactions",
      providesTags: ["Transaction"],
    }),
    createTransaction: builder.mutation<TransactionResponse, CreateTransactionRequest>({
      query: (transaction) => ({
        url: "/transactions",
        method: "POST",
        body: transaction,
      }),
      invalidatesTags: ["Transaction"],
    }),
    updateTransaction: builder.mutation<TransactionResponse, { id: string } & Partial<CreateTransactionRequest>>({
      query: ({ id, ...patch }) => ({
        url: `/transactions/${id}`,
        method: "PUT",
        body: patch,
      }),
      invalidatesTags: ["Transaction"],
    }),
    deleteTransaction: builder.mutation<TransactionResponse, string>({
      query: (id) => ({
        url: `/transactions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Transaction"],
    }),
  }),
})

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionsApi

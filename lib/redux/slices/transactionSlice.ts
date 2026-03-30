import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "@/app/api/auth/axiosInstance";

interface Transaction {
  _id: string;
  userId: {
    firstName: string;
    email: string;
    phone: string;
  };
  service: string;
  network?: string;
  amount: number;
  status: string;
  transaction_date: string;
  raw_response?: any;
  mobile_no?: string;
  createdAt: string;
}

interface TransactionFilter {
  user: string;
  type: string;
  status: string;
  startDate?: Date;
  endDate?: Date;
}

interface TransactionState {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  currentFilter: TransactionFilter;
  currentPage: number;
  totalPages: number;
  totalTransactions: number;
  isLoading: boolean;
  error: string | null;
}

const initialFilter: TransactionFilter = {
  user: "",
  type: "all",
  status: "all",
};

const initialState: TransactionState = {
  transactions: [],
  filteredTransactions: [],
  currentFilter: initialFilter,
  currentPage: 1,
  totalPages: 1,
  totalTransactions: 0,
  isLoading: false,
  error: null,
};

// ✅ Fetch paginated transactions
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchPaginated",
  async (page: number = 1, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/transactions/transactions?page=${page}&limit=100`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch");
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactionFilter: (
      state,
      action: PayloadAction<Partial<TransactionFilter>>
    ) => {
      state.currentFilter = { ...state.currentFilter, ...action.payload };
      state.filteredTransactions = state.transactions.filter((tx) => {
        const { user, type, status, startDate, endDate } = state.currentFilter;

        if (
          user &&
          !tx.userId.email.toLowerCase().includes(user.toLowerCase())
        ) {
          return false;
        }

        if (type !== "all" && tx.service !== type) return false;
        if (status !== "all" && tx.status !== status) return false;

        const txDate = new Date(tx.transaction_date);
        if (startDate && txDate < startDate) return false;
        if (endDate && txDate > endDate) return false;

        return true;
      });
    },
    resetTransactionFilters: (state) => {
      state.currentFilter = initialFilter;
      state.filteredTransactions = state.transactions;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.transactions;
        state.filteredTransactions = action.payload.transactions;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        state.totalTransactions = action.payload.totalTransactions;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || "Failed to fetch transactions";
      });
  },
});

export const { setTransactionFilter, resetTransactionFilters } =
  transactionSlice.actions;
export default transactionSlice.reducer;

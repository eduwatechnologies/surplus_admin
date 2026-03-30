import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
export interface OverallStats {
  totalUsers: number;
  totalTransactions: number;
  totalSuccessTransactions?: number;
  totalFailedTransactions?: number;
  totalPendingTransactions?: number;
  totalRevenue: number;
  totalUserBalance: number;
}

export interface ServiceBreakdown {
  _id: string;
  totalAmount: number;
  count: number;
}

interface DailyStat {
  _id: string; // date (YYYY-MM-DD)
  totalAmount: number;
  count: number;
}

interface StatisticsState {
  overall: OverallStats | null;
  breakdown: ServiceBreakdown[];
  daily: DailyStat[];
  filter: "all" | "day" | "week" | "month" | "year";
  isLoading: boolean;
  error: string | null;
}

const initialState: StatisticsState = {
  overall: null,
  breakdown: [],
  daily: [],
  filter: "all",
  isLoading: false,
  error: null,
};

// ✅ Fetch Overall Stats
export const fetchOverallStats = createAsyncThunk(
  "statistics/fetchOverall",
  async (filter: StatisticsState["filter"], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/statistics/overall?filter=${filter}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch overall stats"
      );
    }
  }
);

// ✅ Fetch Service Breakdown
export const fetchServiceBreakdown = createAsyncThunk(
  "statistics/fetchBreakdown",
  async (filter: StatisticsState["filter"], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/statistics/service-breakdown?filter=${filter}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch breakdown"
      );
    }
  }
);

// ✅ Fetch Daily Stats
export const fetchDailyStats = createAsyncThunk(
  "statistics/fetchDaily",
  async (filter: StatisticsState["filter"], { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/statistics/daily?filter=${filter}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch daily stats"
      );
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<StatisticsState["filter"]>) => {
      state.filter = action.payload;
    },
    resetStats: (state) => {
      state.overall = null;
      state.breakdown = [];
      state.daily = [];
      state.filter = "all";
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ Overall stats
    builder
      .addCase(fetchOverallStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOverallStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.overall = action.payload.data;
      })
      .addCase(fetchOverallStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ✅ Breakdown
    builder
      .addCase(fetchServiceBreakdown.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServiceBreakdown.fulfilled, (state, action) => {
        state.isLoading = false;
        state.breakdown = action.payload.data;
      })
      .addCase(fetchServiceBreakdown.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // ✅ Daily
    builder
      .addCase(fetchDailyStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.daily = action.payload.data;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilter, resetStats } = statisticsSlice.actions;
export default statisticsSlice.reducer;

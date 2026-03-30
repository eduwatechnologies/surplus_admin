import axiosInstance from "@/app/api/auth/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Webhook {
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
}

export interface PaymentProvider {
  _id?: string;
  provider: string;
  baseUrl: string;
  token: string;
  publicKey?: string;
  secretKey?: string;
  enabled: boolean;
  webhook?: Webhook;
  createdAt?: string;
  updatedAt?: string;
}

interface PaymentProviderState {
  providers: PaymentProvider[];
  loading: boolean;
  error: string | null;
  selectedProvider: PaymentProvider | null;
}

const initialState: PaymentProviderState = {
  providers: [],
  loading: false,
  error: null,
  selectedProvider: null,
};

// Async Thunks
export const fetchPaymentProviders = createAsyncThunk(
  "providers/fetchAll",
  async () => {
    const res = await axiosInstance.get("/payment-providers");
    return res.data;
  }
);

export const createPaymentProvider = createAsyncThunk(
  "providers/create",
  async (data: PaymentProvider) => {
    const res = await axiosInstance.post("/payment-providers", data);
    return res.data;
  }
);

export const updatePaymentProvider = createAsyncThunk(
  "providers/update",
  async ({ id, data }: { id: string; data: PaymentProvider }) => {
    const res = await axiosInstance.put(`/payment-providers/${id}`, data);
    return res.data;
  }
);

export const deletePaymentProvider = createAsyncThunk(
  "providers/delete",
  async (id: string) => {
    await axiosInstance.delete(`/payment-providers/${id}`);
    return id;
  }
);

// Slice
const paymentProviderSlice = createSlice({
  name: "paymentProviders",
  initialState,
  reducers: {
    selectProvider: (state, action: PayloadAction<PaymentProvider>) => {
      state.selectedProvider = action.payload;
    },
    clearSelectedProvider: (state) => {
      state.selectedProvider = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchPaymentProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentProviders.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = action.payload;
      })
      .addCase(fetchPaymentProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch providers";
      })

      // Create
      .addCase(createPaymentProvider.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPaymentProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.providers.push(action.payload);
      })
      .addCase(createPaymentProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Create failed";
      })

      // Update
      .addCase(updatePaymentProvider.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentProvider.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.providers.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.providers[index] = action.payload;
        if (state.selectedProvider?._id === action.payload._id) {
          state.selectedProvider = action.payload;
        }
      })
      .addCase(updatePaymentProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Update failed";
      })

      // Delete
      .addCase(deletePaymentProvider.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePaymentProvider.fulfilled, (state, action) => {
        state.loading = false;
        state.providers = state.providers.filter(
          (p) => p._id !== action.payload
        );
      })
      .addCase(deletePaymentProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Delete failed";
      });
  },
});

export const { selectProvider, clearSelectedProvider } =
  paymentProviderSlice.actions;
export default paymentProviderSlice.reducer;

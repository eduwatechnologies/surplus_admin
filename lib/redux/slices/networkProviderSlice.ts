import axiosInstance from "@/app/api/auth/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface Webhook {
  url: string;
  secret: string;
  events: string[];
  enabled: boolean;
}

export interface NetworkProvider {
  _id?: string;
  provider: string;
  token: string;
  baseUrl: string;
  publicKey: string;
  secretKey: string;
  autoWalletFunding: boolean;
  enabled: boolean;
  testMode: boolean;
  webhook: Webhook;
  createdAt?: string;
  updatedAt?: string;
}

export interface State {
  providers: NetworkProvider[];
  loading: boolean;
  error: string | null;
  selectedProvider: NetworkProvider | null;
}

const initialState: State = {
  providers: [],
  loading: false,
  error: null,
  selectedProvider: null,
};

// 🔄 Thunks
export const fetchProviders = createAsyncThunk(
  "providers/fetchAll",
  async () => {
    const res = await axiosInstance.get(`/network-providers`);
    return res.data;
  }
);

export const getProviderById = createAsyncThunk(
  "providers/getById",
  async (id: string) => {
    const res = await axiosInstance.get(`/network-providers/${id}`);
    return res.data;
  }
);

export const createProvider = createAsyncThunk(
  "providers/create",
  async (data: NetworkProvider) => {
    const res = await axiosInstance.post(`/network-providers`, data);
    return res.data;
  }
);

export const updateProvider = createAsyncThunk(
  "providers/update",
  async ({ id, data }: { id: string; data: Partial<NetworkProvider> }) => {
    const res = await axiosInstance.put(`/network-providers/${id}`, data);
    return res.data;
  }
);

export const deleteProvider = createAsyncThunk(
  "providers/delete",
  async (id: string) => {
    await axiosInstance.delete(`/network-providers/${id}`);
    return id;
  }
);

// 🧠 Slice
const networkProviderSlice = createSlice({
  name: "networkProviders",
  initialState,
  reducers: {
    clearSelectedProvider(state) {
      state.selectedProvider = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProviders.fulfilled, (state, action) => {
        state.providers = action.payload;
        state.loading = false;
      })
      .addCase(fetchProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch providers";
      })

      // Get by ID
      .addCase(getProviderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProviderById.fulfilled, (state, action) => {
        state.selectedProvider = action.payload;
        state.loading = false;
      })
      .addCase(getProviderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch provider";
      })

      // Create Provider
      .addCase(createProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProvider.fulfilled, (state, action) => {
        state.providers.push(action.payload);
        state.loading = false;
      })
      .addCase(createProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })

      // Update Provider
      .addCase(updateProvider.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProvider.fulfilled, (state, action) => {
        const index = state.providers.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.providers[index] = action.payload;
        }
        if (state.selectedProvider?._id === action.payload._id) {
          state.selectedProvider = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to update provider";
      })

      // Delete
      .addCase(
        deleteProvider.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.providers = state.providers.filter(
            (p) => p._id !== action.payload
          );
          if (state.selectedProvider?._id === action.payload) {
            state.selectedProvider = null;
          }
        }
      );
  },
});

export const { clearSelectedProvider } = networkProviderSlice.actions;

export default networkProviderSlice.reducer;

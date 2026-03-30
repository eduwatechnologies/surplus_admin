// src/store/categoryProviderSlice.ts
import axiosInstance from "@/app/api/auth/axiosInstance";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface CategoryProvider {
  _id?: string;
  category: string;
  provider: string;
  status: boolean;
}

interface CategoryProviderState {
  items: CategoryProvider[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryProviderState = {
  items: [],
  loading: false,
  error: null,
};

// 📌 Fetch all category providers
// export const fetchCategoryProviders = createAsyncThunk<
//   CategoryProvider[],
//   string, // subServiceId is the payload
//   { rejectValue: string }
// >("categoryProvider/fetchAll", async (subServiceId, { rejectWithValue }) => {
//   try {
//     const res = await axiosInstance.get(`/category-providers${subServiceId}`);
//     return res.data;
//   } catch (err: any) {
//     return rejectWithValue(err.response?.data?.error || "Failed to fetch");
//   }
// });

export const fetchCategoryProviders = createAsyncThunk<
  CategoryProvider[],
  string, // subServiceId is the payload
  { rejectValue: string }
>("categoryProvider/fetchAll", async (subServiceId, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get(
      `/category-providers/sub-service/${subServiceId}`
    );
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to fetch");
  }
});

// 📌 Create new category provider
export const createCategoryProvider = createAsyncThunk<
  CategoryProvider,
  Omit<CategoryProvider, "_id">,
  { rejectValue: string }
>("categoryProvider/create", async (data, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/category-providers", data);
    return res.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to create");
  }
});

// 📌 Update category provider
export const updateCategoryProvider = createAsyncThunk<
  CategoryProvider,
  { id: string; provider: string; status?: boolean },
  { rejectValue: string }
>(
  "categoryProvider/update",
  async ({ id, provider, status }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/category-providers/${id}`, {
        provider,
        status,
      });
      return res.data as CategoryProvider;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update category provider"
      );
    }
  }
);

// 📌 Delete category provider
export const deleteCategoryProvider = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("categoryProvider/delete", async (id, { rejectWithValue }) => {
  try {
    await axiosInstance.delete(`/category-providers/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || "Failed to delete");
  }
});

const categoryProviderSlice = createSlice({
  name: "categoryProvider",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCategoryProviders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategoryProviders.fulfilled,
        (state, action: PayloadAction<CategoryProvider[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchCategoryProviders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching category providers";
      })

      // CREATE
      .addCase(createCategoryProvider.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // UPDATE
      .addCase(updateCategoryProvider.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.items[index] = action.payload;
      })

      // DELETE
      .addCase(deleteCategoryProvider.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export default categoryProviderSlice.reducer;

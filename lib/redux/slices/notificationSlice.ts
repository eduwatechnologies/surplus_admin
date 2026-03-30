import axiosInstance from "@/app/api/auth/axiosInstance";
import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationItem = {
  _id: string;
  title: string;
  message: string;
  imageUrl?: string | null;
  userId?: string | null;
  read?: boolean;
  createdAt?: string;
};

type CreateNotificationPayload = {
  title: string;
  message: string;
  imageUrl?: string | null;
  userId?: string | null;
};

type UpdateNotificationPayload = {
  id: string;
  data: CreateNotificationPayload;
};

interface NotificationsState {
  items: NotificationItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const resp = await axiosInstance.get("/notifications/all");
      return Array.isArray(resp.data) ? (resp.data as NotificationItem[]) : [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch notifications"
      );
    }
  }
);

export const createNotification = createAsyncThunk(
  "notifications/create",
  async (payload: CreateNotificationPayload, { rejectWithValue }) => {
    try {
      const resp = await axiosInstance.post("/notifications/create", payload);
      return resp.data as NotificationItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to create notification"
      );
    }
  }
);

export const updateNotification = createAsyncThunk(
  "notifications/update",
  async ({ id, data }: UpdateNotificationPayload, { rejectWithValue }) => {
    try {
      const resp = await axiosInstance.put(`/notifications/${id}`, data);
      return resp.data as NotificationItem;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to update notification"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/notifications/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to delete notification"
      );
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    resetNotifications: (state) => {
      state.items = [];
      state.isLoading = false;
      state.error = null;
    },
    setNotifications: (state, action: PayloadAction<NotificationItem[]>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to fetch notifications";
      })
      .addCase(createNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = [action.payload, ...state.items];
      })
      .addCase(createNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to create notification";
      })
      .addCase(updateNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.map((n) => (n._id === action.payload._id ? action.payload : n));
      })
      .addCase(updateNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to update notification";
      })
      .addCase(deleteNotification.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((n) => n._id !== action.payload);
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || "Failed to delete notification";
      });
  },
});

export const { resetNotifications, setNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;

import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
  email: string;
  phone: string;
  balance: string;
  pinStatus: boolean;
  status: "active" | "suspended";
  createdAt: string;
  lastLogin: string;
  state: string;
  owning: string;
  referredBy?: string;
  account: {
    accountNumber: string;
    bankName: string;
  };
}

interface ReferralStats {
  totalEarnings: number;
  totalReferrals: number;
  referrals: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    createdAt: string;
    isVerified: boolean;
    role: string;
    totalSpent: number;
    totalTransactionCount: number;
  }[];
}

interface Wallet {
  _id: string;
  balance: string;
}

interface UserState {
  users: User[];
  transactions: {
    airtime: any[];
    data: any[];
    electricity: any[];
    cable_tv: any[];
    wallet: any[];
    others: any[];
  };
  wallet: Wallet | null;
  filteredUsers: User[];
  searchQuery: string;
  selectedUser: User | null;
  isLoading: boolean;
  error: string | null;
  detailLoading: boolean;
  selectedUserDetail: User | null;
  referralStats: ReferralStats | null;
  totalTransactionValue: number;
}

const initialState: UserState = {
  users: [],
  transactions: {
    airtime: [],
    data: [],
    electricity: [],
    wallet: [],
    cable_tv: [],

    others: [],
  },
  detailLoading: false,
  selectedUserDetail: null,
  referralStats: null,
  totalTransactionValue: 0,
  wallet: null,
  filteredUsers: [],
  searchQuery: "",
  selectedUser: null,
  isLoading: false,
  error: null,
};

// ✅ fetchUsers with Axios + Authorization + Logging
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axiosInstance.get("/auth/users");
  return response.data as User[];
});

export const RefundUser = createAsyncThunk(
  "users/refundUser",
  async ({ userId, amount }: { userId: string; amount: string }) => {
    console.log(userId);
    const response = await axiosInstance.post("/billstack/refund", {
      userId,
      amount,
    });
    // Assume the backend returns the updated user or just success
    return { userId, amount, type: "credit" as const };
  }
);

export const DefundUser = createAsyncThunk(
  "users/defundUser",
  async ({ userId, amount }: { userId: string; amount: string }) => {
    const response = await axiosInstance.post("/billstack/defund", {
      userId,
      amount,
    });
    // Assume the backend returns the updated user or just success
    return { userId, amount, type: "debit" as const };
  }
);

export const updatePassword = createAsyncThunk(
  "auth/updatePassword",
  async (
    data: { userId: string; newPassword: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        "/auth/admin/update-user-password",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "UpdatePassword reset failed"
      );
    }
  }
);

export const updatePin = createAsyncThunk(
  "auth/updatePin",
  async (data: { userId: string; newpin: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth//admin/update-user-pin",
        data
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Updatepin reset failed"
      );
    }
  }
);

export const updateStatus = createAsyncThunk(
  "users/updateStatus",
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/status", {
        userId,
      });
      return { userId, status: response.data.status };
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to toggle status"
      );
    }
  }
);

// Add to your imports at top
export const fetchUserDetail = createAsyncThunk(
  "users/fetchUserDetail",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/auth/userInfo/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateOwning = createAsyncThunk(
  "users/updateOwning",
  async (data: { userId: string; amount: string }) => {
    try {
      const response = await axiosInstance.put("/auth/admin/add-owing", data);
      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.error || "UpdateOwning request failed"
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "users/updateUserRole",
  async (data: { userId: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/admin/update-role", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Update role failed"
      );
    }
  }
);

export const updateReferral = createAsyncThunk(
  "users/updateReferral",
  async (data: { userId: string; newReferralCode: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/auth/admin/update-referral", data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Update referral failed"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId: string) => {
    await axiosInstance.delete(`/auth/users/${userId}`);
    return userId;
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredUsers = state.users.filter(
        (user) =>
          user.lastName.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.email.toLowerCase().includes(action.payload.toLowerCase()) ||
          user.phone.includes(action.payload)
      );
    },
    selectUser: (state, action: PayloadAction<string>) => {
      state.selectedUser =
        state.users.find((user) => user._id === action.payload) || null;
    },
    toggleUserStatus: (state, action: PayloadAction<string>) => {
      const user = state.users.find((user) => user._id === action.payload);
      if (user) {
        user.status = user.status === "active" ? "suspended" : "active";
      }

      // Also update in filtered users
      const filteredUser = state.filteredUsers.find(
        (user) => user._id === action.payload
      );
      if (filteredUser) {
        filteredUser.status =
          filteredUser.status === "active" ? "suspended" : "active";
      }
    },
    updateWalletBalance: (
      state,
      action: PayloadAction<{
        userId: string;
        amount: string;
        type: "credit" | "debit";
      }>
    ) => {
      const { userId, amount, type } = action.payload;

      const updateBalance = (user: User | undefined) => {
        if (!user) return;

        const currentBalance =
          typeof user.balance === "string"
            ? Number.parseFloat(user.balance.replace("₦", "").replace(/,/g, ""))
            : Number(user.balance); // Handle number directly

        const amountValue = Number.parseFloat(amount);
        const newBalance =
          type === "credit"
            ? currentBalance + amountValue
            : currentBalance - amountValue;

        user.balance = `₦${newBalance.toLocaleString()}`;
      };

      const user = state.users.find((user) => user._id === userId);
      updateBalance(user);

      const filteredUser = state.filteredUsers.find(
        (user) => user._id === userId
      );
      updateBalance(filteredUser);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(RefundUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(RefundUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const { userId, amount, type } = action.payload;
        // Credit the wallet
        userSlice.caseReducers.updateWalletBalance(state, {
          payload: { userId, amount, type: "credit" },
          type: "users/updateWalletBalance",
        });
      })

      .addCase(RefundUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(DefundUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(DefundUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const { userId, amount, type } = action.payload;
        // Debit the wallet
        userSlice.caseReducers.updateWalletBalance(state, {
          payload: { userId, amount, type: "debit" },
          type: "users/updateWalletBalance",
        });
      })
      .addCase(DefundUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch users";
      })

      .addCase(updatePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update password";
      })
      .addCase(updatePin.fulfilled, (state, action) => {
        // optional: update pin state
      })
      .addCase(updatePin.rejected, (state, action) => {
        state.error = action.error.message || "Failed to update pin";
      })

      .addCase(updateStatus.fulfilled, (state, action) => {
        const user = state.users.find((u) => u._id === action.payload.userId);
        if (user) user.status = action.payload.status;

        const filteredUser = state.filteredUsers.find(
          (u) => u._id === action.payload.userId
        );
        if (filteredUser) filteredUser.status = action.payload.status;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        // Update user in the list
        const user = state.users.find((u) => u._id === action.payload.user.id);
        if (user) user.role = action.payload.user.role;
        
        // Update selectedUserDetail if it matches
        if (state.selectedUserDetail && state.selectedUserDetail._id === action.payload.user.id) {
            state.selectedUserDetail.role = action.payload.user.role;
        }
      })
      .addCase(updateReferral.fulfilled, (state, action) => {
        const userId = action.meta.arg.userId;
        const newReferredBy = action.payload.referredBy;

        // Update user in the list
        const user = state.users.find((u) => u._id === userId);
        if (user) user.referredBy = newReferredBy;
        
        // Update selectedUserDetail if it matches
        if (state.selectedUserDetail && state.selectedUserDetail._id === userId) {
            state.selectedUserDetail.referredBy = newReferredBy;
        }
      })
      .addCase(fetchUserDetail.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDetail.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedUserDetail = action.payload.user;
        state.referralStats = action.payload.referralStats || null;
        state.totalTransactionValue = action.payload.totalTransactionValue || 0;
        state.transactions = action.payload.transactions || {
          airtime: [],
          data: [],
          electricity: [],
          wallet: [],
          cable_tv: [],
          others: [],
        };
      })
      .addCase(fetchUserDetail.rejected, (state, action) => {
        state.detailLoading = false;
        // state.error = action.payload?.message as any|| "Failed to fetch user details";
      })
      .addCase(updateOwning.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to update owing";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user._id !== action.payload);
        state.filteredUsers = state.filteredUsers.filter(
          (user) => user._id !== action.payload
        );
      });
  },
});

export const {
  selectUser,
  setSearchQuery,
  toggleUserStatus,
  updateWalletBalance,
} = userSlice.actions;
export default userSlice.reducer;

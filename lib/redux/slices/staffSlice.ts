import axiosInstance from "@/app/api/auth/axiosInstance";
import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface Permission {
  _id: string;
  id: string;
  name: string;
  description: string;
  module: string;
}

type RolePermissionRef = string | Permission;

export interface Role {
  _id: string;
  name: string;
  description: string;
  permissions: RolePermissionRef[];
  createdAt: string;
  updatedAt: string;
}
export interface StaffMember {
  _id: string;
  name: string;
  email: string;
  // role: "admin" | "manager" | "support";
  role: string;
  status: "active" | "suspended";
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
  phone: string;
  avatar?: string;
  password?: string;
}

export interface ActivityLog {
  _id: string;
  staffId: string;
  staffName: string;
  action: string;
  description: string;
  module: string;
  timestamp: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
}

interface StaffState {
  staff: StaffMember[];
  filteredStaff: StaffMember[];
  roles: Role[];
  permissions: Permission[];
  activityLogs: ActivityLog[];
  filteredLogs: ActivityLog[];
  searchQuery: string;
  selectedStaff: StaffMember | null;
  selectedRole: Role | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  staff: [],
  filteredStaff: [],
  roles: [],
  permissions: [],
  activityLogs: [],
  filteredLogs: [],
  searchQuery: "",
  selectedStaff: null,
  selectedRole: null,
  isLoading: false,
  error: null,
};

// 🔁 Get all staff
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/staff");
      return res.data.staff as StaffMember[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch staff"
      );
    }
  }
);
// 🔍 Get staff by ID
export const fetchStaffById = createAsyncThunk(
  "staff/fetchById",
  async (id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.get(`/staff/${id}`);
      return res.data.staff as StaffMember;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch staff"
      );
    }
  }
);
// Add new staff
export const addStaffMember = createAsyncThunk(
  "staff/addStaffMember",
  async (
    staffData: Omit<
      StaffMember,
      "_id" | "createdAt" | "updatedAt" | "lastLogin" | "avatar"
    >,
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.post("/staff/create", staffData);
      return response.data.staff; // adjust this depending on your API response shape
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to add staff");
    }
  }
);
// Update the existing staff
export const updateStaffMember = createAsyncThunk(
  "staff/updateStaffMember",
  async (
    staffData: Partial<StaffMember> & { id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/staff/${staffData.id}`,
        staffData
      );
      return response.data.staff;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to update staff");
    }
  }
);

export const fetchRoles = createAsyncThunk(
  "roles/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/roles");
      return res.data.roles as Role[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch roles"
      );
    }
  }
);

export const addRole = createAsyncThunk(
  "roles/addRole",
  async (roleData: Omit<Role, "_id" | "createdAt" | "updatedAt">, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/roles", roleData);
      return res.data.role as Role;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to create role"
      );
    }
  }
);

export const updateRole = createAsyncThunk(
  "roles/updateRole",
  async (roleData: Partial<Role> & { id: string }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/roles/${roleData.id}`, roleData);
      return res.data.role as Role;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to update role"
      );
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  "permissions/fetchAll",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/permissions");
      return res.data.permissions as Permission[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch permissions"
      );
    }
  }
);

export const fetchActivityLogs = createAsyncThunk(
  "logs/fetchActivityLogs",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/logs");
      return res.data.logs as ActivityLog[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch logs"
      );
    }
  }
);

export const logActivity = createAsyncThunk(
  "logs/logActivity",
  async (logData: Omit<ActivityLog, "_id" | "timestamp">, thunkAPI) => {
    try {
      const res = await axiosInstance.post("/logs", logData);
      return res.data.log as ActivityLog;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to log activity"
      );
    }
  }
);

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    setStaffSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredStaff = state.staff.filter(
        (staff) =>
          staff.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          staff.email.toLowerCase().includes(action.payload.toLowerCase()) ||
          staff.phone.includes(action.payload)
      );
    },
    selectStaff: (state, action: PayloadAction<string>) => {
      state.selectedStaff =
        state.staff.find((staff) => staff._id === action.payload) || null;
    },
    selectRole: (state, action: PayloadAction<string>) => {
      state.selectedRole =
        state.roles.find((role) => role._id === action.payload) || null;
    },
    filterActivityLogs: (
      state,
      action: PayloadAction<{
        module?: string;
        staffId?: string;
        actionType?: string;
      }>
    ) => {
      const { module, staffId, actionType } = action.payload;
      state.filteredLogs = state.activityLogs.filter((log) => {
        if (module && log.module !== module) return false;
        if (staffId && log.staffId !== staffId) return false;
        if (actionType && log.action !== actionType) return false;
        return true;
      });
    },
    toggleStaffStatus: (state, action: PayloadAction<string>) => {
      const staff = state.staff.find((s) => s._id === action.payload);
      if (staff) {
        staff.status = staff.status === "active" ? "suspended" : "active";
        staff.updatedAt = new Date().toISOString();
      }

      // Also update in filtered staff
      const filteredStaff = state.filteredStaff.find(
        (s) => s._id === action.payload
      );
      if (filteredStaff) {
        filteredStaff.status =
          filteredStaff.status === "active" ? "suspended" : "active";
        filteredStaff.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch staff
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false;
        state.staff = action.payload;
        state.filteredStaff = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch staff";
      })

      // Fetch roles
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.roles = action.payload;
      })

      // Fetch permissions
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.permissions = action.payload;
      })

      // Fetch activity logs
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs = action.payload;
        state.filteredLogs = action.payload;
      })

      // Add staff member
      .addCase(addStaffMember.fulfilled, (state, action) => {
        state.staff.push(action.payload);
        state.filteredStaff = state.staff;
      })

      // Update staff member
      .addCase(updateStaffMember.fulfilled, (state, action) => {
        const updatedId = action.payload?._id || action.payload?.id;
        const index = state.staff.findIndex((s) => s._id === updatedId);
        if (index !== -1) {
          state.staff[index] = { ...state.staff[index], ...action.payload };
        }

        // Also update in filtered staff
        const filteredIndex = state.filteredStaff.findIndex((s) => s._id === updatedId);
        if (filteredIndex !== -1) {
          state.filteredStaff[filteredIndex] = {
            ...state.filteredStaff[filteredIndex],
            ...action.payload,
          };
        }
      })

      // Add role
      .addCase(addRole.fulfilled, (state, action) => {
        state.roles.push(action.payload);
      })

      // Update role
      .addCase(updateRole.fulfilled, (state, action) => {
        const index = state.roles.findIndex(
          (r) => r._id === action.payload._id
        );
        if (index !== -1) {
          state.roles[index] = { ...state.roles[index], ...action.payload };
        }
      })

      // Log activity
      .addCase(logActivity.fulfilled, (state, action) => {
        state.activityLogs.unshift(action.payload);
        state.filteredLogs = state.activityLogs;
      });
  },
});

export const {
  setStaffSearchQuery,
  selectStaff,
  selectRole,
  filterActivityLogs,
  toggleStaffStatus,
} = staffSlice.actions;
export default staffSlice.reducer;

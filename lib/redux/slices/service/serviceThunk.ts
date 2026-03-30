import axiosInstance from "@/app/api/auth/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { Service, ServicePlan, SubService } from "./type";

// Fetch all services with subservices
export const fetchServices = createAsyncThunk(
  "service/fetchServices",
  async (_, thunkAPI) => {
    try {
      const res = await axiosInstance.get("/services/with-subservices");
      return res.data as Service[];
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to fetch services"
      );
    }
  }
);

// Toggle subservice status
export const toggleSubServiceStatus = createAsyncThunk(
  "service/toggleSubServiceStatus",
  async (id: string, thunkAPI) => {
    try {
      const res = await axiosInstance.patch(`/subservices/${id}/toggle-status`);
      return res.data.data as SubService;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to toggle subservice"
      );
    }
  }
);

// Async thunk
export const switchProvider = createAsyncThunk(
  "subservices/switchProvider",
  async (
    { id, provider }: { id: string; provider: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.patch(
        `/subservices/${id}/switch-provider`,
        { provider }
      );
      return res.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new service
export const addService = createAsyncThunk(
  "service/addService",
  async (
    serviceData: Omit<
      Service,
      "_id" | "createdAt" | "updatedAt" | "subServices"
    >,
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post("/services", serviceData);
      return { ...res.data.data, subServices: [] } as Service;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to add service"
      );
    }
  }
);

// Update a service
export const updateService = createAsyncThunk(
  "service/updateService",
  async ({ id, data }: { id: string; data: Partial<Service> }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/services/${id}`, data);
      return res.data.data as Service;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to update service"
      );
    }
  }
);

// Delete a service
export const deleteService = createAsyncThunk(
  "service/deleteService",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/services/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to delete service"
      );
    }
  }
);

// Add a new subservice
export const addSubService = createAsyncThunk(
  "service/addSubService",
  async (
    subServiceData: Omit<
      SubService,
      "_id" | "createdAt" | "updatedAt" | "servicePlans"
    >,
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.post("/subservices", subServiceData);
      return res.data.data as SubService;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to add subservice"
      );
    }
  }
);

// Update subservice
export const updateSubService = createAsyncThunk(
  "service/updateSubService",
  async ({ id, data }: { id: string; data: Partial<SubService> }, thunkAPI) => {
    try {
      const res = await axiosInstance.put(`/subservices/${id}`, data);
      return res.data.data as SubService;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to update subservice"
      );
    }
  }
);

// Delete subservice
export const deleteSubService = createAsyncThunk(
  "service/deleteSubService",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/subservices/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to delete subservice"
      );
    }
  }
);

// Add a new service plan
export const addServicePlan = createAsyncThunk(
  "service/addServicePlan",
  async (
    {
      subServiceId,
      payload,
    }: {
      subServiceId: string;
      payload: Omit<
        ServicePlan,
        "id" | "createdAt" | "updatedAt" | "subServiceId"
      >;
    },
    thunkAPI
  ) => {
    try {
      // ✅ Add subServiceId to the body
      const res = await axiosInstance.post(`/plans`, {
        ...payload,
        subServiceId,
      });

      return res.data.data as ServicePlan;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to add service plan"
      );
    }
  }
);

// Update a service plan
export const updateServicePlan = createAsyncThunk(
  "service/updateServicePlan",
  async (
    { id, data }: { id: string; data: Partial<ServicePlan> },
    thunkAPI
  ) => {
    try {
      const res = await axiosInstance.put(`/plans/${id}`, data);
      return res.data.data as ServicePlan;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to update service plan"
      );
    }
  }
);

// Delete a service plan
export const deleteServicePlan = createAsyncThunk(
  "service/deleteServicePlan",
  async (id: string, thunkAPI) => {
    try {
      await axiosInstance.delete(`/plans/${id}`);
      return id;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.msg || "Failed to delete service plan"
      );
    }
  }
);

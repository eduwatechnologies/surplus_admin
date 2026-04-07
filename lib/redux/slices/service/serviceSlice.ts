// src/features/vtu/vtuSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Service, SubService } from "./type";
import {
  addService,
  addSubService,
  addServicePlan,
  deleteService,
  deleteServicePlan,
  deleteSubService,
  fetchServices,
  toggleServiceStatus,
  toggleSubServiceStatus,
  updateService,
  updateServicePlan,
  updateSubService,
  switchProvider,
} from "./serviceThunk";

interface VtuState {
  services: Service[];
  filteredServices: Service[];
  selectedService: Service | null;
  selectedSubService: SubService | null;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  list: any[];
  loading: boolean;
}

const initialState: VtuState = {
  services: [],
  filteredServices: [],
  selectedService: null,
  selectedSubService: null,
  list: [],
  searchQuery: "",
  isLoading: false,
  error: null,
  loading: false,
};

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    setServiceSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.filteredServices = state.services.filter((service) =>
        service.name.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    selectService: (state, action: PayloadAction<string>) => {
      state.selectedService =
        state.services.find((s) => s._id === action.payload) || null;
    },
    selectSubService: (state, action: PayloadAction<string>) => {
      for (const service of state.services) {
        const sub = service.subServices.find((s) => s._id === action.payload);
        if (sub) {
          state.selectedSubService = sub;
          return;
        }
      }
      state.selectedSubService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Fetch services ---
      .addCase(fetchServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.isLoading = false;
        state.services = action.payload;
        state.filteredServices = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- Toggle subservice status ---
      .addCase(toggleSubServiceStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const parent = state.services.find((s) => s._id === updated.serviceId);
        if (parent) {
          const sub = parent.subServices.find((s) => s._id === updated._id);
          if (sub) sub.status = updated.status;
        }
      })
      .addCase(toggleSubServiceStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Add service ---
      .addCase(addService.fulfilled, (state, action) => {
        state.services.push(action.payload);
        state.filteredServices = state.services;
      })
      .addCase(addService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Update service ---
      .addCase(updateService.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.services.findIndex((s) => s._id === updated._id);
        if (idx > -1) {
          const existing = state.services[idx];
          state.services[idx] = {
            ...existing,
            ...updated,
            subServices: Array.isArray((updated as any).subServices)
              ? (updated as any).subServices
              : existing.subServices,
          };
        }
        state.filteredServices = state.services;
      })
      .addCase(updateService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      .addCase(toggleServiceStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.services.findIndex((s) => s._id === updated._id);
        if (idx > -1) {
          const existing = state.services[idx];
          state.services[idx] = {
            ...existing,
            ...updated,
            subServices: existing.subServices,
          };
        }
        state.filteredServices = state.services;
      })
      .addCase(toggleServiceStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Delete service ---
      .addCase(deleteService.fulfilled, (state, action) => {
        const id = action.payload;
        state.services = state.services.filter((s) => s._id !== id);
        state.filteredServices = state.services;
      })
      .addCase(deleteService.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // --- Add subservice ---
    builder
      .addCase(addSubService.fulfilled, (state, action) => {
        const newSubService = action.payload;
        const parentService = state.services.find(
          (s) => s._id === newSubService.serviceId
        );
        if (parentService) {
          parentService.subServices.push(newSubService);
        }
      })

      .addCase(addSubService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Update subservice ---
      .addCase(updateSubService.fulfilled, (state, action) => {
        const updated = action.payload;
        const parent = state.services.find((s) => s._id === updated.serviceId);
        if (parent) {
          const idx = parent.subServices.findIndex(
            (s) => s._id === updated._id
          );
          if (idx > -1) parent.subServices[idx] = updated;
        }
      })
      .addCase(updateSubService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Delete subservice ---
      .addCase(deleteSubService.fulfilled, (state, action) => {
        const id = action.payload;
        for (const service of state.services) {
          service.subServices = service.subServices.filter((s) => s._id !== id);
        }
      })
      .addCase(deleteSubService.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Add service plan ---
      .addCase(addServicePlan.fulfilled, (state, action) => {
        const plan = action.payload;
        const planSubId = String((plan as any).subServiceId || "");
        const parentService = state.services.find((s) =>
          s.subServices.some((sub) => String((sub as any)._id) === planSubId)
        );
        const parentSub = parentService?.subServices.find(
          (sub) => String((sub as any)._id) === planSubId
        );
        if (parentSub) parentSub.servicePlans.push(plan);
      })
      .addCase(addServicePlan.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Update service plan ---
      .addCase(updateServicePlan.fulfilled, (state, action) => {
        const updatedPlan = action.payload;
        const updatedSubId = String((updatedPlan as any).subServiceId || "");
        const updatedId = String((updatedPlan as any)._id || "");
        for (const service of state.services) {
          const sub = service.subServices.find(
            (s) => String((s as any)._id) === updatedSubId
          );
          if (sub) {
            const idx = sub.servicePlans.findIndex(
              (p) => String((p as any)._id) === updatedId
            );
            if (idx > -1) sub.servicePlans[idx] = updatedPlan;
          }
        }
      })
      .addCase(updateServicePlan.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // --- Delete service plan ---
      .addCase(deleteServicePlan.fulfilled, (state, action) => {
        const id = action.payload;
        for (const service of state.services) {
          for (const sub of service.subServices) {
            sub.servicePlans = sub.servicePlans.filter((p) => p._id !== id);
          }
        }
      })
      .addCase(deleteServicePlan.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(switchProvider.pending, (state) => {
        state.loading = true;
      })
      .addCase(switchProvider.fulfilled, (state, action) => {
        state.loading = false;
        // update the subservice in the list
        const index = state.list.findIndex(
          (sub) => sub._id === action.payload._id
        );
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(switchProvider.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setServiceSearchQuery, selectService, selectSubService } =
  serviceSlice.actions;

export default serviceSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CommissionSetting {
  id: string
  service: string
  type: "percentage" | "fixed"
  value: string
  minAmount: string
  maxAmount: string
  status: "active" | "inactive"
}

interface NotificationSetting {
  emailNotifications: Record<string, boolean>
  smsNotifications: Record<string, boolean>
}

interface GeneralSetting {
  platformName: string
  supportEmail: string
  supportPhone: string
  timezone: string
  currency: string
}

interface SecuritySetting {
  twoFactorAuth: boolean
  sessionTimeout: boolean
  sessionDuration: number
  ipWhitelist: boolean
  allowedIps: string
}

interface MaintenanceSetting {
  maintenanceMode: boolean
  maintenanceMessage: string
}

interface SettingState {
  commissions: CommissionSetting[]
  notifications: NotificationSetting
  general: GeneralSetting
  security: SecuritySetting
  maintenance: MaintenanceSetting
  isLoading: boolean
  error: string | null
}

const initialState: SettingState = {
  commissions: [],
  notifications: {
    emailNotifications: {
      failedTransactions: true,
      largeFunding: true,
      systemDowntime: true,
      dailyReports: false,
      weeklyReports: true,
      userRegistrations: false,
      lowBalance: true,
    },
    smsNotifications: {
      criticalErrors: true,
      systemDowntime: true,
      largeFunding: true,
      failedTransactions: false,
    },
  },
  general: {
    platformName: "VTU Admin Dashboard",
    supportEmail: "support@yourvtu.com",
    supportPhone: "+234 800 123 4567",
    timezone: "africa/lagos",
    currency: "ngn",
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: true,
    sessionDuration: 30,
    ipWhitelist: false,
    allowedIps: "",
  },
  maintenance: {
    maintenanceMode: false,
    maintenanceMessage: "We are currently performing scheduled maintenance. Please check back later.",
  },
  isLoading: false,
  error: null,
}

const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCommissions: (state, action: PayloadAction<CommissionSetting[]>) => {
      state.commissions = action.payload
    },
    updateEmailNotification: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      const { key, value } = action.payload
      state.notifications.emailNotifications[key] = value
    },
    updateSmsNotification: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      const { key, value } = action.payload
      state.notifications.smsNotifications[key] = value
    },
    updateGeneralSetting: (state, action: PayloadAction<Partial<GeneralSetting>>) => {
      state.general = { ...state.general, ...action.payload }
    },
    updateSecuritySetting: (state, action: PayloadAction<Partial<SecuritySetting>>) => {
      state.security = { ...state.security, ...action.payload }
    },
    toggleMaintenanceMode: (state, action: PayloadAction<boolean>) => {
      state.maintenance.maintenanceMode = action.payload
    },
    updateMaintenanceMessage: (state, action: PayloadAction<string>) => {
      state.maintenance.maintenanceMessage = action.payload
    },
  },
})

export const {
  setCommissions,
  updateEmailNotification,
  updateSmsNotification,
  updateGeneralSetting,
  updateSecuritySetting,
  toggleMaintenanceMode,
  updateMaintenanceMessage,
} = settingSlice.actions
export default settingSlice.reducer

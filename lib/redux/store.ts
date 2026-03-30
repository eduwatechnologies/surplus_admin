import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import transactionReducer from "./slices/transactionSlice";
import serviceReducer from "./slices/service/serviceSlice";
import settingReducer from "./slices/settingSlice";
import staffReducer from "./slices/staffSlice";
import networkProviders from "./slices/networkProviderSlice";
import paymentProviders from "./slices/paymentProviderSlice";
import categoryProviders from "./slices/categoryProviderSlice";

import statisticReducer from "./slices/statisticSlice";
import notificationsReducer from "./slices/notificationSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    transactions: transactionReducer,
    services: serviceReducer,
    settings: settingReducer,
    staff: staffReducer,
    statistics: statisticReducer,
    networkProviders: networkProviders,
    paymentProviders: paymentProviders,
    categoryProviders: categoryProviders,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { StatsCards } from "@/components/stats-cards";
import { RecentTransactions } from "@/components/recent-transactions";
import { useAppDispatch } from "@/lib/redux/hooks";
import { RootState } from "@/lib/redux/store";
import { setUser } from "@/lib/redux/slices/authSlice";
import { fetchTransactions } from "@/lib/redux/slices/transactionSlice";
import { fetchRoles, fetchPermissions } from "@/lib/redux/slices/staffSlice";
import {
  fetchOverallStats,
  fetchServiceBreakdown,
  fetchDailyStats,
} from "@/lib/redux/slices/statisticSlice";
import { useLicense } from "@/components/use-license";
import { useAuth } from "@/components/providers/auth-provider";

export default function Dashboard() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const { overall, breakdown } = useSelector(
    (state: RootState) => state.statistics
  );
  const { transactions = [], currentPage } = useSelector(
    (state: RootState) => state.transactions
  );

  const [filter, setFilter] = useState<
    "day" | "week" | "month" | "year" | "all"
  >("all");
  const { analyticsAllowed, loaded: licenseLoaded } = useLicense();

  useEffect(() => {
    if (!user) return;
    dispatch(setUser(user));
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [user, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTransactions(currentPage));
    }
  }, [dispatch, user, currentPage]);

  useEffect(() => {
    if (!licenseLoaded) return;
    if (analyticsAllowed) {
      dispatch(fetchOverallStats(filter));
      dispatch(fetchServiceBreakdown(filter));
      dispatch(fetchDailyStats(filter));
    }
  }, [dispatch, filter, analyticsAllowed, licenseLoaded]);

  const recentTransactions = (transactions || [])
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here s what's happening with your VTU platform.
              </p>
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="border rounded-md px-3 py-1 text-sm"
            >
              <option value="all">All</option>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>

          {analyticsAllowed && overall && <StatsCards overall={overall} breakdown={breakdown} />}
          {!analyticsAllowed && (
            <div className="p-4 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-800">
              Analytics is not available on your current plan.
            </div>
          )}

          <div className="grid gap-6">
            <RecentTransactions transactionData={recentTransactions} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

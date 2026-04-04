"use client";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Header } from "./home/header";
import { HeroSection } from "./home/heroSection";
import { ServiceSection } from "./home/serviceSection";
import { StatsSection } from "./home/statsSection";
import { TestimonialsSection } from "./home/testimonalSection";
import { FaqSection } from "./home/faqSection";
import { CtaSection } from "./home/ctaSection";
import { Footer } from "./home/footer";
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
import { fetchOverallStats, fetchServiceBreakdown, fetchDailyStats } from "@/lib/redux/slices/statisticSlice";
import { useAuth } from "@/components/providers/auth-provider";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type MerchantDashboard = {
  totals: {
    totalTransactions: number;
    successCount: number;
    failedCount: number;
    totalSelling: number;
    totalProfit: number;
  };
  topServices: Array<{ service: string; count: number; selling: number; profit: number }>;
  recentTransactions: any[];
};

const merchantStatusBadge = (status: string) => {
  if (status === "success") return <Badge className="bg-green-100 text-green-700">Success</Badge>;
  if (status === "failed") return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
  if (status === "pending") return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
  return <Badge>{status}</Badge>;
};

function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <HeroSection />
      <ServiceSection />
      <StatsSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}

export default function AdminHome() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const toast = useToast();
  const { overall, breakdown } = useSelector((state: RootState) => state.statistics);
  const { transactions = [], currentPage } = useSelector((state: RootState) => state.transactions);
  const [filter, setFilter] = useState<"day" | "week" | "month" | "year" | "all">("all");
  const [merchantDash, setMerchantDash] = useState<MerchantDashboard | null>(null);
  const [merchantLoading, setMerchantLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === "user") {
      try {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        document.cookie = "admin_token=; Max-Age=0; path=/; SameSite=Lax";
      } catch {}
      window.location.href = "/login?error=" + encodeURIComponent("This account cannot access the admin portal");
      return;
    }
    dispatch(setUser(user));
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [user, dispatch]);

  useEffect(() => {
    if (!user) return;
    if (user.role !== "merchant" && user.role !== "reseller") return;
    setMerchantLoading(true);
    axiosInstance
      .get("/tenants/dashboard", { params: { filter } })
      .then((res) => {
        setMerchantDash((res.data?.data || null) as MerchantDashboard | null);
      })
      .catch((err: any) => {
        const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
        toast.toast({ title: "Failed", description: msg, variant: "destructive" });
        setMerchantDash(null);
      })
      .finally(() => setMerchantLoading(false));
  }, [user, filter, toast]);

  useEffect(() => {
    if (user && user.role !== "merchant" && user.role !== "reseller") {
      dispatch(fetchTransactions(currentPage));
    }
  }, [dispatch, user, currentPage]);

  useEffect(() => {
    if (!user) return;
    if (user?.role === "merchant" || user?.role === "reseller") return;
    dispatch(fetchOverallStats(filter));
    dispatch(fetchServiceBreakdown(filter));
    dispatch(fetchDailyStats(filter));
  }, [dispatch, filter, user?.role]);

  const recentTransactions = useMemo(
    () =>
      (transactions || [])
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 10),
    [transactions]
  );

  if (!user) return <Landing />;

  if (user.role === "merchant" || user.role === "reseller") {
    const totals = merchantDash?.totals || {
      totalTransactions: 0,
      successCount: 0,
      failedCount: 0,
      totalSelling: 0,
      totalProfit: 0,
    };
    const failedRate =
      totals.totalTransactions > 0 ? (totals.failedCount / totals.totalTransactions) * 100 : 0;
    const recent = Array.isArray(merchantDash?.recentTransactions) ? merchantDash!.recentTransactions : [];
    const topServices = Array.isArray(merchantDash?.topServices) ? merchantDash!.topServices : [];

    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          <main className="relative flex-1 space-y-6 p-6 bg-gradient-to-b from-white via-[color:var(--brand-50)] to-white">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[color:var(--brand-blob-20)] blur-3xl" />
              <div className="absolute -bottom-56 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
            </div>
            <div className="relative flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Merchant Dashboard</h1>
                <p className="text-sm text-slate-600">Track sales, profit, and customer activity.</p>
              </div>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <option value="all">All</option>
                <option value="day">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Sales</CardTitle>
                  <CardDescription>{merchantLoading ? "Loading..." : "Selling price sum"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  ₦{Number(totals.totalSelling || 0).toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Total Profit</CardTitle>
                  <CardDescription>{merchantLoading ? "Loading..." : "Selling - platform"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  ₦{Number(totals.totalProfit || 0).toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>{merchantLoading ? "Loading..." : "Total count"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">
                  {Number(totals.totalTransactions || 0).toLocaleString()}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Failed Rate</CardTitle>
                  <CardDescription>{merchantLoading ? "Loading..." : "Failed / total"}</CardDescription>
                </CardHeader>
                <CardContent className="text-2xl font-bold">{failedRate.toFixed(1)}%</CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Services</CardTitle>
                  <CardDescription>Top by profit</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service</TableHead>
                        <TableHead className="text-right">Count</TableHead>
                        <TableHead className="text-right">Sales</TableHead>
                        <TableHead className="text-right">Profit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topServices.length ? (
                        topServices.map((s) => (
                          <TableRow key={String(s.service)}>
                            <TableCell className="capitalize">{s.service || "-"}</TableCell>
                            <TableCell className="text-right">{Number(s.count || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-right">₦{Number(s.selling || 0).toLocaleString()}</TableCell>
                            <TableCell className="text-right">₦{Number(s.profit || 0).toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                            {merchantLoading ? "Loading..." : "No data"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest customer transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tx</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Selling</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recent.length ? (
                        recent.map((t: any) => {
                          const name = [t.userId?.firstName, t.userId?.lastName].filter(Boolean).join(" ").trim();
                          const selling = typeof t.selling_price === "number" ? t.selling_price : t.amount;
                          const date = t.transaction_date || t.createdAt;
                          return (
                            <TableRow key={String(t._id)}>
                              <TableCell className="font-medium">TRNS{String(t._id).slice(-5)}</TableCell>
                              <TableCell>{name || t.userId?.email || "-"}</TableCell>
                              <TableCell className="capitalize">{t.service || "-"}</TableCell>
                              <TableCell className="text-right">
                                {typeof selling === "number" ? `₦${selling.toLocaleString()}` : "-"}
                              </TableCell>
                              <TableCell>{merchantStatusBadge(String(t.status || "-"))}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {date ? new Date(date).toLocaleDateString() : "-"}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                            {merchantLoading ? "Loading..." : "No transactions"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="relative flex-1 space-y-6 p-6 bg-gradient-to-b from-white via-[color:var(--brand-50)] to-white">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-[color:var(--brand-blob-20)] blur-3xl" />
            <div className="absolute -bottom-56 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-600">Welcome back! Here s what's happening with your VTU platform.</p>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <option value="all">All</option>
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
          {overall && <StatsCards overall={overall} breakdown={breakdown} />}
          <div className="grid gap-6">
            <RecentTransactions transactionData={recentTransactions} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

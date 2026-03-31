"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { ArrowRight, CheckCircle, Headphones, Menu, Phone, Shield, X, Zap } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const brandName = process.env.NEXT_PUBLIC_BRAND_NAME || "Surplus TopUp";

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm brand-bg">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-900">{brandName}</span>
                <span className="text-xs text-slate-500">Merchant admin portal</span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6 text-sm">
              <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">
                How it works
              </a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">
                FAQ
              </a>
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm brand-bg"
              >
                Merchant sign up
              </Link>
            </div>

            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {open && (
            <div className="md:hidden pb-4">
              <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3">
                <a
                  href="#features"
                  className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#how-it-works"
                  className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  How it works
                </a>
                <a
                  href="#faq"
                  className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                  onClick={() => setOpen(false)}
                >
                  FAQ
                </a>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white brand-bg"
                    onClick={() => setOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <section className="relative overflow-hidden bg-gradient-to-b from-white via-[color:var(--brand-50)] to-white">
        <div className="absolute inset-0">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[color:var(--brand-blob-20)] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-sky-400/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-200)] bg-[color:var(--brand-50)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-700)]">
                <Zap className="h-4 w-4" />
                For merchants & staff
              </div>

              <h1 className="mt-5 text-balance text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Manage your VTU business with ease.
              </h1>

              <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg lg:mx-0 lg:max-w-2xl">
                Sign up as a merchant, get your own storefront, customize your pricing, and track sales. Staff can manage the entire platform in one place.
              </p>

              <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg brand-bg px-5 py-3 text-sm font-semibold text-white shadow-sm"
                >
                  Create merchant account
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Sign in
                </Link>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-3 text-sm text-slate-700 lg:justify-start">
                  <CheckCircle className="h-5 w-5 brand-text" />
                  Branded portal
                </div>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-3 text-sm text-slate-700 lg:justify-start">
                  <Shield className="h-5 w-5 text-sky-600" />
                  Secure access
                </div>
                <div className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white/80 px-3 py-3 text-sm text-slate-700 lg:justify-start">
                  <Headphones className="h-5 w-5 text-violet-600" />
                  Reliable support
                </div>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:max-w-none" id="features">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[color:var(--brand-blob-60)] via-white to-sky-200/60 blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                <div className="p-8">
                  <h2 className="text-xl font-semibold text-slate-900">Merchant features</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3">
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      Create your store: <span className="font-semibold brand-text-strong">/m/[slug]</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      Set pricing with fixed, flat markup or percent markup
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                      Brand name, logo, support email/phone
                    </div>
                  </div>
                  <div className="mt-6" id="how-it-works">
                    <h3 className="text-sm font-semibold text-slate-900">How it works</h3>
                    <ol className="mt-3 space-y-2 text-sm text-slate-600">
                      <li>1. Create a merchant account</li>
                      <li>2. Configure branding and pricing</li>
                      <li>3. Share your link and start selling</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16" id="faq">
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="font-semibold text-slate-900">Can merchants sign up themselves?</p>
              <p className="mt-1 text-slate-600">Yes. Merchants sign up on this portal and get their own tenant automatically.</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900">Can staff still manage the whole platform?</p>
              <p className="mt-1 text-slate-600">Yes. Staff accounts login as usual and access the full dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-sm text-slate-500">
          © {new Date().getFullYear()} {brandName}
        </div>
      </footer>
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
          <main className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Merchant Dashboard</h1>
                <p className="text-muted-foreground">Track sales, profit, and customer activity.</p>
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
        <main className="flex-1 space-y-6 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here s what's happening with your VTU platform.</p>
            </div>
            <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border rounded-md px-3 py-1 text-sm">
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

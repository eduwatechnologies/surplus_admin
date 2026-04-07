"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Eye } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type TxUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

type Tx = {
  _id: string;
  userId?: TxUser | null;
  service?: string;
  network?: string;
  amount?: number | null;
  platform_price?: number | null;
  selling_price?: number | null;
  merchant_profit?: number | null;
  status?: string;
  transaction_date?: string;
  createdAt?: string;
  reference_no?: string;
  provider_reference?: string;
  mobile_no?: string;
  meter_no?: string;
  iucno?: string;
  message?: string;
  raw_response?: string;
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-700">Success</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
    case "pending":
      return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export default function MerchantTransactionsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";

  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [rows, setRows] = useState<Tx[]>([]);

  const [selectedTx, setSelectedTx] = useState<Tx | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!isMerchant) window.location.href = "/";
  }, [user, isMerchant]);

  const profitOf = (t: Tx) => {
    if (typeof t.merchant_profit === "number" && Number.isFinite(t.merchant_profit)) return t.merchant_profit;
    const sp = typeof t.selling_price === "number" ? t.selling_price : null;
    const pp = typeof t.platform_price === "number" ? t.platform_price : null;
    if (typeof sp === "number" && typeof pp === "number") return sp - pp;
    return null;
  };

  const fetchRows = async (nextPage: number) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/tenants/transactions", {
        params: {
          page: nextPage,
          limit: 50,
          type,
          status,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          search: search.trim() || undefined,
        },
      });
      setRows((res.data?.transactions || []) as Tx[]);
      setTotalPages(Number(res.data?.totalPages || 1));
      setTotalTransactions(Number(res.data?.totalTransactions || 0));
      setPage(Number(res.data?.currentPage || nextPage));
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isMerchant) return;
    fetchRows(1);
  }, [user, isMerchant]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((t) => {
      const name = [t.userId?.firstName, t.userId?.lastName].filter(Boolean).join(" ").toLowerCase();
      const email = String(t.userId?.email || "").toLowerCase();
      const phone = String(t.userId?.phone || "").toLowerCase();
      const ref = String(t.reference_no || "").toLowerCase();
      const pref = String(t.provider_reference || "").toLowerCase();
      const number = String(t.mobile_no || t.meter_no || t.iucno || "").toLowerCase();
      return (
        name.includes(q) ||
        email.includes(q) ||
        phone.includes(q) ||
        ref.includes(q) ||
        pref.includes(q) ||
        number.includes(q)
      );
    });
  }, [rows, search]);

  const resetFilters = () => {
    setType("all");
    setStatus("all");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearch("");
    fetchRows(1);
  };

  const openModal = (tx: Tx) => {
    setSelectedTx(tx);
    setOpen(true);
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">View your customers transactions and profit.</p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[160px]">
                  <Label>Transaction Type</Label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="airtime">Airtime</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="cable_tv">Cable TV</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="exam_pin">Exam</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[160px]">
                  <Label>Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 min-w-[160px]">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? startDate.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1 min-w-[160px]">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? endDate.toLocaleDateString() : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-1 min-w-[220px]">
                  <Label>Search</Label>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name, email, phone, ref, number"
                  />
                </div>

                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={() => fetchRows(1)}
                    disabled={loading}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    {loading ? "Loading..." : "Apply Filters"}
                  </Button>
                  <Button variant="outline" onClick={resetFilters} disabled={loading}>
                    Reset
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Showing {filteredRows.length} of {totalTransactions} total transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Platform</TableHead>
                    <TableHead className="text-right">Selling</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRows.length ? (
                    filteredRows.map((t) => {
                      const name = [t.userId?.firstName, t.userId?.lastName].filter(Boolean).join(" ").trim() || "N/A";
                      const date = t.transaction_date || t.createdAt || null;
                      const profit = profitOf(t);
                      return (
                        <TableRow key={String(t._id)}>
                          <TableCell className="font-medium">TRNS{String(t._id).slice(-5)}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{name}</span>
                              <span className="text-xs text-muted-foreground">{t.userId?.email || "-"}</span>
                            </div>
                          </TableCell>
                          <TableCell className="capitalize">{t.service || "-"}</TableCell>
                          <TableCell className="capitalize">{t.network || "-"}</TableCell>
                          <TableCell className="text-right">
                            {typeof t.platform_price === "number" ? `₦${t.platform_price.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {typeof t.selling_price === "number" ? `₦${t.selling_price.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            {typeof profit === "number" ? `₦${profit.toLocaleString()}` : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(String(t.status || "-"))}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {date ? new Date(date).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => openModal(t)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-10">
                        {loading ? "Loading..." : "No transactions found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="w-full flex justify-center items-center mt-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button variant="outline" disabled={page <= 1 || loading} onClick={() => fetchRows(page - 1)}>
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button variant="outline" disabled={page >= totalPages || loading} onClick={() => fetchRows(page + 1)}>
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Transaction Details</DialogTitle>
                <DialogDescription>Transaction log and raw response.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Reference</div>
                    <div className="font-medium">{selectedTx?.reference_no || selectedTx?.provider_reference || "-"}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-muted-foreground">Status</div>
                    <div className="font-medium">{String(selectedTx?.status || "-")}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Message</div>
                  <div className="font-medium">{selectedTx?.message || "-"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-muted-foreground">Raw Response</div>
                  <pre className="whitespace-pre-wrap break-words rounded-md bg-muted p-3 text-xs">
                    {selectedTx?.raw_response || "-"}
                  </pre>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


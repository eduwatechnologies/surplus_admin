"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type Customer = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  kycStatus?: string;
  kycLevel?: number;
  kycVerifiedAt?: string | null;
  kycNotes?: string | null;
  createdAt?: string;
  lastLogin?: string;
  balance?: number;
};

type Tx = {
  _id: string;
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

export default function CustomerDetailsPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const userId = String(params?.id || "").trim();

  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [kycStatus, setKycStatus] = useState<"unverified" | "pending" | "verified" | "rejected">(
    "unverified"
  );
  const [kycLevel, setKycLevel] = useState("0");
  const [kycNotes, setKycNotes] = useState("");
  const [kycSaving, setKycSaving] = useState(false);
  const [statusSaving, setStatusSaving] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [txPage, setTxPage] = useState(1);
  const [txTotalPages, setTxTotalPages] = useState(1);
  const [txTotal, setTxTotal] = useState(0);
  const [txRows, setTxRows] = useState<Tx[]>([]);

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

  const loadCustomer = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/tenants/customers/${encodeURIComponent(userId)}`);
      const c = (res.data?.data || null) as Customer | null;
      setCustomer(c);
      const nextStatus = String(c?.kycStatus || "unverified").toLowerCase();
      if (["unverified", "pending", "verified", "rejected"].includes(nextStatus)) {
        setKycStatus(nextStatus as any);
      } else {
        setKycStatus("unverified");
      }
      setKycLevel(
        typeof c?.kycLevel === "number" && Number.isFinite(c.kycLevel) ? String(c.kycLevel) : "0"
      );
      setKycNotes(typeof c?.kycNotes === "string" ? c.kycNotes : "");
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
      setCustomer(null);
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async (page: number) => {
    if (!userId) return;
    setTxLoading(true);
    try {
      const res = await axiosInstance.get(
        `/tenants/customers/${encodeURIComponent(userId)}/transactions`,
        { params: { page, limit: 50 } }
      );
      setTxRows((res.data?.transactions || []) as Tx[]);
      setTxTotalPages(Number(res.data?.totalPages || 1));
      setTxTotal(Number(res.data?.totalTransactions || 0));
      setTxPage(Number(res.data?.currentPage || page));
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
      setTxRows([]);
      setTxTotalPages(1);
      setTxTotal(0);
      setTxPage(1);
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !isMerchant) return;
    loadCustomer();
    loadTransactions(1);
  }, [user, isMerchant, userId]);

  const saveKyc = async () => {
    if (!userId) return;
    setKycSaving(true);
    try {
      const level = Number(kycLevel);
      if (!Number.isFinite(level) || level < 0 || level > 10) {
        toast.toast({
          title: "Invalid KYC level",
          description: "KYC level must be between 0 and 10",
          variant: "destructive",
        });
        return;
      }
      await axiosInstance.patch(`/tenants/customers/${encodeURIComponent(userId)}/kyc`, {
        kycStatus,
        kycLevel: Math.trunc(level),
        kycNotes: kycNotes.trim() ? kycNotes.trim() : null,
      });
      toast.toast({ title: "Saved", description: "KYC updated successfully" });
      await loadCustomer();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setKycSaving(false);
    }
  };

  const setUserStatus = async (next: "active" | "suspended") => {
    if (!userId) return;
    setStatusSaving(true);
    try {
      await axiosInstance.patch(`/tenants/customers/${encodeURIComponent(userId)}/status`, {
        status: next,
      });
      toast.toast({ title: "Saved", description: "Customer status updated" });
      await loadCustomer();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setStatusSaving(false);
    }
  };

  const fullName = useMemo(() => {
    if (!customer) return "";
    return [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  }, [customer]);

  if (!user) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer</h1>
          <p className="text-muted-foreground">Customer profile and transactions.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push("/customers")}>
            Back
          </Button>
          <Button
            onClick={() =>
              router.push(`/pricing?scope=user&userId=${encodeURIComponent(userId)}`)
            }
            disabled={!userId}
          >
            Set Individual Pricing
          </Button>
        </div>
      </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>{loading ? "Loading..." : "Customer information."}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Name</div>
                <div className="font-medium">{fullName || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Role</div>
                <div className="font-medium">{customer?.role || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Email</div>
                <div className="font-medium">{customer?.email || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Phone</div>
                <div className="font-medium">{customer?.phone || "-"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Status</div>
                <div className="font-medium">{customer?.status || "-"}</div>
              </div>
              <div className="flex items-end gap-2 flex-wrap">
                <Button
                  variant="outline"
                  disabled={statusSaving || loading || !customer}
                  onClick={() => setUserStatus(customer?.status === "suspended" ? "active" : "suspended")}
                >
                  {statusSaving
                    ? "Saving..."
                    : customer?.status === "suspended"
                      ? "Activate Customer"
                      : "Suspend Customer"}
                </Button>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Balance</div>
                <div className="font-medium">
                  {typeof customer?.balance === "number" ? `₦${customer.balance.toLocaleString()}` : "-"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>KYC</CardTitle>
              <CardDescription>Verify, reject, or mark a customer as pending/unverified.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={kycStatus} onValueChange={(v) => setKycStatus(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unverified">Unverified</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="verified">Verified</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Level (0 - 10)</Label>
                  <Input value={kycLevel} onChange={(e) => setKycLevel(e.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Notes (optional)</Label>
                  <Input value={kycNotes} onChange={(e) => setKycNotes(e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={saveKyc} disabled={kycSaving || loading || !customer}>
                  {kycSaving ? "Saving..." : "Save KYC"}
                </Button>
                <div className="text-sm text-muted-foreground">
                  Verified At: {customer?.kycVerifiedAt ? new Date(customer.kycVerifiedAt).toLocaleString() : "-"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Transactions</CardTitle>
              <CardDescription>
                Showing {txRows.length} of {txTotal} total
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead className="text-right">Platform</TableHead>
                    <TableHead className="text-right">Selling</TableHead>
                    <TableHead className="text-right">Profit</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {txRows.length ? (
                    txRows.map((t) => {
                      const date = t.transaction_date || t.createdAt || null;
                      const profit = profitOf(t);
                      return (
                        <TableRow key={String(t._id)}>
                          <TableCell className="font-medium">TRNS{String(t._id).slice(-5)}</TableCell>
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
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-10">
                        {txLoading ? "Loading..." : "No transactions found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              <div className="w-full flex justify-center items-center mt-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    disabled={txPage <= 1 || txLoading}
                    onClick={() => loadTransactions(txPage - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {txPage} of {txTotalPages}
                  </span>
                  <Button
                    variant="outline"
                    disabled={txPage >= txTotalPages || txLoading}
                    onClick={() => loadTransactions(txPage + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
    </>
  );
}

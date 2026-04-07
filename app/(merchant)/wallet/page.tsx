"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type CurrentUserResponse = {
  user: {
    _id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    balance?: number;
    bonus?: number;
    account?: Array<{
      bankName?: string | null;
      accountNumber?: string | null;
      accountName?: string | null;
      virtualAccountId?: string | null;
    }>;
  };
};

type WalletAccount = {
  _id: string;
  bankName?: string | null;
  bankCode?: string | null;
  accountNumber?: string | null;
  accountName?: string | null;
  reference?: string | null;
  providerCreatedAt?: string | null;
  createdAt?: string;
};

type Tx = {
  _id: string;
  service?: string;
  amount?: number | null;
  status?: string;
  transaction_type?: "credit" | "debit" | "refund";
  note?: string | null;
  provider_reference?: string | null;
  reference_no?: string | null;
  createdAt?: string;
};

const formatMoney = (n: any) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "₦0.00";
  return `₦${x.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const statusBadge = (status?: string) => {
  const s = String(status || "").toLowerCase();
  if (s === "success") return <Badge className="bg-green-100 text-green-700">Success</Badge>;
  if (s === "failed") return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
  if (s === "pending") return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
  return <Badge>{status || "-"}</Badge>;
};

export default function WalletPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";

  const [profile, setProfile] = useState<CurrentUserResponse["user"] | null>(null);
  const [accounts, setAccounts] = useState<WalletAccount[]>([]);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(false);

  const [bank, setBank] = useState("");
  const [creating, setCreating] = useState(false);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [meRes, accRes, txRes] = await Promise.allSettled([
        axiosInstance.get("/users/user"),
        axiosInstance.get(`/wallets/virtual-account/${encodeURIComponent(String(user?.id || ""))}`),
        axiosInstance.get("/transactions/user_transaction"),
      ]);

      if (meRes.status === "fulfilled") {
        setProfile((meRes.value.data as CurrentUserResponse)?.user || null);
      } else {
        setProfile(null);
      }

      if (accRes.status === "fulfilled") {
        setAccounts(((accRes.value.data?.accounts || []) as WalletAccount[]) || []);
      } else {
        const status = (accRes as any)?.reason?.response?.status;
        if (status === 404) setAccounts([]);
      }

      if (txRes.status === "fulfilled") {
        const all = ((txRes.value.data?.transactions || []) as Tx[]) || [];
        setTxs(all);
      } else {
        setTxs([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    if (!isMerchant) {
      window.location.href = "/";
      return;
    }
    loadAll();
  }, [user, isMerchant]);

  const displayedAccounts = useMemo(() => {
    if (accounts.length) return accounts;
    const fallback = profile?.account || [];
    return fallback
      .filter((a) => a?.accountNumber)
      .map((a, idx) => ({
        _id: `fallback-${idx}`,
        bankName: a.bankName || null,
        accountNumber: a.accountNumber || null,
        accountName: a.accountName || null,
        bankCode: null,
        reference: null,
        providerCreatedAt: null,
      })) as WalletAccount[];
  }, [accounts, profile?.account]);

  const walletTxs = useMemo(() => {
    return txs
      .filter((t) => String(t.service || "").toLowerCase() === "wallet")
      .sort((a, b) => {
        const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return db - da;
      })
      .slice(0, 50);
  }, [txs]);

  const createVirtualAccount = async () => {
    if (!user?.id) return;
    const b = bank.trim();
    if (!b) {
      toast.toast({ title: "Missing bank", description: "Enters a bank identifier supported by your provider", variant: "destructive" });
      return;
    }

    const firstName = profile?.firstName || "";
    const lastName = profile?.lastName || "";
    const email = profile?.email || user.email || "";
    const phone = profile?.phone || "";

    if (!firstName || !lastName || !email || !phone) {
      toast.toast({ title: "Incomplete profile", description: "Update your profile (first name, last name, email, phone) before creating a virtual account.", variant: "destructive" });
      return;
    }

    setCreating(true);
    try {
      const reference = `va-${user.id}-${Date.now()}`;
      await axiosInstance.post("/wallets/create-virtual-account", {
        userId: user.id,
        email,
        reference,
        firstName,
        lastName,
        phone,
        bank: b,
      });
      toast.toast({ title: "Created", description: "Virtual account created successfully." });
      setBank("");
      await loadAll();
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
              <p className="text-muted-foreground">View your wallet balance, virtual accounts, and funding history.</p>
            </div>
            <Button variant="outline" onClick={loadAll} disabled={loading}>
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Balance</CardTitle>
                <CardDescription>Current wallet balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{formatMoney(profile?.balance)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Bonus</CardTitle>
                <CardDescription>Bonus balance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{formatMoney(profile?.bonus)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Virtual Accounts</CardTitle>
                <CardDescription>Accounts for wallet funding</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">{displayedAccounts.length}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Virtual accounts</CardTitle>
              <CardDescription>Transfer to any of these accounts to fund your wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Input id="bank" value={bank} onChange={(e) => setBank(e.target.value)} placeholder="e.g. WEMA" />
                </div>
                <div className="flex items-end">
                  <Button onClick={createVirtualAccount} disabled={creating || loading}>
                    {creating ? "Creating..." : "Create virtual account"}
                  </Button>
                </div>
              </div>

              {displayedAccounts.length === 0 ? (
                <div className="text-sm text-muted-foreground">No virtual account found yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bank</TableHead>
                        <TableHead>Account name</TableHead>
                        <TableHead>Account number</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {displayedAccounts.map((a) => (
                        <TableRow key={a._id}>
                          <TableCell>{a.bankName || "-"}</TableCell>
                          <TableCell>{a.accountName || "-"}</TableCell>
                          <TableCell className="font-medium">{a.accountNumber || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Funding history</CardTitle>
              <CardDescription>Last 50 wallet transactions for this account.</CardDescription>
            </CardHeader>
            <CardContent>
              {walletTxs.length === 0 ? (
                <div className="text-sm text-muted-foreground">No wallet transactions found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {walletTxs.map((t) => (
                        <TableRow key={t._id}>
                          <TableCell>
                            {t.createdAt ? new Date(t.createdAt).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>{t.transaction_type || "-"}</TableCell>
                          <TableCell className="font-medium">{formatMoney(t.amount)}</TableCell>
                          <TableCell>{statusBadge(t.status)}</TableCell>
                          <TableCell className="text-xs">
                            {t.provider_reference || t.reference_no || "-"}
                          </TableCell>
                          <TableCell className="text-xs">{t.note || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


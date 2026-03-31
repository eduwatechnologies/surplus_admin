"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import Link from "next/link";

type Customer = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  kycStatus?: string;
  createdAt?: string;
  lastLogin?: string;
};

export default function CustomersPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"all" | "user" | "agent">("all");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Customer[]>([]);

  useEffect(() => {
    if (!user) return;
    if (!isMerchant) window.location.href = "/";
  }, [user, isMerchant]);

  const fetchRows = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/tenants/customers", {
        params: {
          role,
          search: search.trim() || undefined,
          limit: 500,
        },
      });
      const data = (res.data?.data || []) as Customer[];
      setRows(Array.isArray(data) ? data : []);
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
    fetchRows();
  }, [user, isMerchant]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const name = [r.firstName, r.lastName].filter(Boolean).join(" ").toLowerCase();
      return (
        name.includes(q) ||
        String(r.email || "").toLowerCase().includes(q) ||
        String(r.phone || "").toLowerCase().includes(q)
      );
    });
  }, [rows, search]);

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">Users that registered through your merchant account.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Customer List</CardTitle>
              <CardDescription>Search and filter your customers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Select value={role} onValueChange={(v) => setRole(v as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, phone" />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={fetchRows} disabled={loading}>
                    {loading ? "Loading..." : "Refresh"}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>KYC</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.length ? (
                      filteredRows.map((r) => {
                        const fullName = [r.firstName, r.lastName].filter(Boolean).join(" ").trim() || "-";
                        return (
                          <TableRow key={String(r._id)}>
                            <TableCell className="font-medium">{fullName}</TableCell>
                            <TableCell>{r.email || "-"}</TableCell>
                            <TableCell>{r.phone || "-"}</TableCell>
                            <TableCell>{r.role || "-"}</TableCell>
                            <TableCell>{r.status || "-"}</TableCell>
                            <TableCell className="capitalize">{r.kycStatus || "-"}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" asChild>
                                <Link href={`/customers/${encodeURIComponent(String(r._id))}`}>View</Link>
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-10">
                          {loading ? "Loading..." : "No customers found"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

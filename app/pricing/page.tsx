"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/providers/auth-provider";
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PricingOverride = {
  pricingType: "fixed" | "flat_markup" | "percent_markup";
  value: number;
  active: boolean;
};

type CatalogPlan = {
  planId: string;
  name: string;
  validity: string | null;
  category: string | null;
  serviceType: string;
  network: string;
  basePrice: number | null;
  sellingPrice: number | null;
  override?: PricingOverride | null;
  userOverride?: PricingOverride | null;
  tenantOverride?: PricingOverride | null;
  overrideLevel?: "user" | "tenant" | null;
};

type Customer = {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
};

export default function PricingPage() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";
  const searchParams = useSearchParams();

  const [scope, setScope] = useState<"tenant" | "user">("tenant");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [network, setNetwork] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [bulkSaving, setBulkSaving] = useState(false);

  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [pricingType, setPricingType] = useState<PricingOverride["pricingType"]>("flat_markup");
  const [value, setValue] = useState("");
  const [bulkPricingType, setBulkPricingType] = useState<PricingOverride["pricingType"]>("flat_markup");
  const [bulkValue, setBulkValue] = useState("");

  useEffect(() => {
    if (!user) return;
    if (!isMerchant) window.location.href = "/";
  }, [user, isMerchant]);

  useEffect(() => {
    if (!user || !isMerchant) return;
    const initialScope = String(searchParams.get("scope") || "").toLowerCase();
    const initialUserId = String(searchParams.get("userId") || "").trim();
    if (initialScope === "user") setScope("user");
    if (initialUserId) setSelectedUserId(initialUserId);
  }, [user, isMerchant, searchParams]);

  useEffect(() => {
    if (!user || !isMerchant) return;
    axiosInstance
      .get("/tenants/customers", { params: { limit: 500 } })
      .then((res) => {
        const rows = (res.data?.data || []) as Customer[];
        setCustomers(Array.isArray(rows) ? rows : []);
      })
      .catch(() => {
        setCustomers([]);
      });
  }, [user, isMerchant]);

  const selectedPlan = useMemo(
    () => plans.find((p) => String(p.planId) === String(selectedPlanId)) || null,
    [plans, selectedPlanId]
  );

  const currentOverride = useMemo(() => {
    if (!selectedPlan) return null;
    if (scope === "user") {
      return selectedPlan.userOverride || null;
    }
    return selectedPlan.override || null;
  }, [scope, selectedPlan]);

  useEffect(() => {
    if (!selectedPlan) return;
    setPricingType(currentOverride?.pricingType || "flat_markup");
    setValue(
      typeof currentOverride?.value === "number" && Number.isFinite(currentOverride.value)
        ? String(currentOverride.value)
        : ""
    );
  }, [selectedPlan, currentOverride]);

  const loadPlans = async () => {
    if (!network.trim() || !category.trim()) {
      toast.toast({
        title: "Missing fields",
        description: "Network and category are required",
        variant: "destructive",
      });
      return;
    }
    if (scope === "user" && !selectedUserId) {
      toast.toast({
        title: "Select customer",
        description: "Pick a customer to set individual pricing",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const path =
        scope === "user"
          ? `/tenants/users/${encodeURIComponent(selectedUserId)}/pricing/catalog`
          : "/tenants/pricing/catalog";
      const res = await axiosInstance.get(path, { params: { network, category } });
      const rows = (res.data?.data || []) as CatalogPlan[];
      setPlans(rows);
      const first = rows[0]?.planId ? String(rows[0].planId) : "";
      setSelectedPlanId(first);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    if (!selectedPlan) {
      toast.toast({ title: "Select a plan", description: "Choose a plan first", variant: "destructive" });
      return;
    }
    if (scope === "user" && !selectedUserId) {
      toast.toast({
        title: "Select customer",
        description: "Pick a customer to set individual pricing",
        variant: "destructive",
      });
      return;
    }
    const n = Number(value);
    if (!Number.isFinite(n)) {
      toast.toast({ title: "Invalid value", description: "Enter a valid number", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const path =
        scope === "user"
          ? `/tenants/users/${encodeURIComponent(selectedUserId)}/pricing/plans`
          : "/tenants/pricing/plans";
      await axiosInstance.put(path, {
        items: [{ planId: selectedPlan.planId, pricingType, value: n, active: true }],
      });
      toast.toast({ title: "Saved", description: "Pricing updated successfully" });
      await loadPlans();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const applyBulk = async () => {
    if (!plans.length) {
      toast.toast({
        title: "No plans loaded",
        description: "Load plans first, then apply bulk pricing",
        variant: "destructive",
      });
      return;
    }
    if (scope === "user" && !selectedUserId) {
      toast.toast({
        title: "Select customer",
        description: "Pick a customer to set individual pricing",
        variant: "destructive",
      });
      return;
    }
    const n = Number(bulkValue);
    if (!Number.isFinite(n)) {
      toast.toast({ title: "Invalid value", description: "Enter a valid number", variant: "destructive" });
      return;
    }

    setBulkSaving(true);
    try {
      const path =
        scope === "user"
          ? `/tenants/users/${encodeURIComponent(selectedUserId)}/pricing/plans`
          : "/tenants/pricing/plans";
      await axiosInstance.put(path, {
        items: plans.map((p) => ({
          planId: p.planId,
          pricingType: bulkPricingType,
          value: n,
          active: true,
        })),
      });
      toast.toast({ title: "Saved", description: `Bulk pricing updated for ${plans.length} plans` });
      await loadPlans();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setBulkSaving(false);
    }
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Service Pricing</h1>
            <p className="text-muted-foreground">Set your selling price per plan.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pick Service Plans</CardTitle>
              <CardDescription>Load plans by network and category, then set your price.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Apply To</Label>
                  <Select value={scope} onValueChange={(v) => setScope(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tenant">All Customers (Default)</SelectItem>
                      <SelectItem value="user">Single Customer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Customer</Label>
                  <Select
                    value={selectedUserId}
                    onValueChange={setSelectedUserId}
                    disabled={scope !== "user"}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={scope === "user" ? "Select customer" : "Default pricing"} />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((c) => {
                        const fullName = [c.firstName, c.lastName].filter(Boolean).join(" ").trim();
                        const label = fullName || c.email || c.phone || String(c._id);
                        return (
                          <SelectItem key={String(c._id)} value={String(c._id)}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Input value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="mtn or 01" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="SME" />
                </div>
                <div className="flex items-end gap-2">
                  <Button variant="outline" onClick={loadPlans} disabled={loading}>
                    {loading ? "Loading..." : "Load Plans"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Bulk Pricing Type</Label>
                  <Select value={bulkPricingType} onValueChange={(v) => setBulkPricingType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat_markup">Flat Markup</SelectItem>
                      <SelectItem value="percent_markup">Percent Markup</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Bulk Value</Label>
                  <Input
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    placeholder="Enter value"
                  />
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={applyBulk}
                    disabled={bulkSaving || loading || saving || plans.length === 0}
                  >
                    {bulkSaving ? "Saving..." : `Apply to ${plans.length || 0} Plans`}
                  </Button>
                </div>
                <div className="flex items-end text-xs text-muted-foreground">
                  Applies to currently loaded network + category plans.
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Plan</Label>
                  <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger>
                      <SelectValue placeholder={plans.length ? "Select plan" : "Load plans first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {plans.map((p) => (
                        <SelectItem key={String(p.planId)} value={String(p.planId)}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Platform Price</Label>
                  <Input value={typeof selectedPlan?.basePrice === "number" ? String(selectedPlan.basePrice) : ""} readOnly />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Pricing Type</Label>
                  <Select value={pricingType} onValueChange={(v) => setPricingType(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat_markup">Flat Markup</SelectItem>
                      <SelectItem value="percent_markup">Percent Markup</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{scope === "user" ? "Customer Price" : "Your Plan Price"}</Label>
                  <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Enter value" />
                </div>
                <div className="flex items-end">
                  <Button onClick={save} disabled={saving || !selectedPlan}>
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </div>

              {selectedPlan && (
                <div className="text-sm text-muted-foreground">
                  Current selling price:{" "}
                  <span className="font-medium text-foreground">
                    {typeof selectedPlan.sellingPrice === "number" ? selectedPlan.sellingPrice : "-"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

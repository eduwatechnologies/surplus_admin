"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

type ServiceRow = {
  _id: string;
  type: string;
  name?: string;
  status?: boolean;
};

function normalizeServiceKey(input: string) {
  const raw = String(input || "").trim().toLowerCase();
  if (raw === "cabletv" || raw === "cable_tv" || raw === "cable-tv") return "cable";
  if (raw === "exampin" || raw === "exam_pin" || raw === "exam-pin") return "exam";
  return raw;
}

export default function PricingClient() {
  const toast = useToast();
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";
  const searchParams = useSearchParams();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scope, setScope] = useState<"tenant" | "user">("tenant");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const [serviceType, setServiceType] = useState<
    "data" | "airtime" | "electricity" | "cabletv" | "exampin"
  >("data");
  const [network, setNetwork] = useState<
    "mtn" | "airtel" | "glo" | "9mobile" | ""
  >("");
  const [category, setCategory] = useState<string>("SME");
  const [loading, setLoading] = useState(false);

  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [priceEdits, setPriceEdits] = useState<Record<string, string>>({});
  const [savingPlanId, setSavingPlanId] = useState<string>("");
  const [filterText, setFilterText] = useState("");
  const [serviceStatus, setServiceStatus] = useState<Record<string, boolean>>({});

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

  useEffect(() => {
    if (!user || !isMerchant) return;
    axiosInstance
      .get("/services")
      .then((res) => {
        const rows = (res.data || []) as ServiceRow[];
        const next: Record<string, boolean> = {};
        for (const r of rows) {
          const k = normalizeServiceKey(r?.type || "");
          if (!k) continue;
          next[k] = !!r?.status;
        }
        setServiceStatus(next);
      })
      .catch(() => {
        setServiceStatus({});
      });
  }, [user, isMerchant]);

  const categoryOptions = useMemo(
    () => ["SME", "GIFTING", "CG", "CG_LITE", "AWOOF", "CORPORATE", "DIRECT", "VTU"],
    []
  );

  const services = useMemo(
    () => [
      { key: "data" as const, title: "Data subscription", desc: "Set prices per data plan" },
      { key: "airtime" as const, title: "Airtime", desc: "Coming soon" },
      { key: "electricity" as const, title: "Electricity", desc: "Coming soon" },
      { key: "cabletv" as const, title: "Cable TV", desc: "Coming soon" },
      { key: "exampin" as const, title: "Exam pins", desc: "Coming soon" },
    ],
    []
  );

  const serviceAvailability = useMemo(() => {
    const availability: Record<string, boolean> = {};
    for (const s of services) {
      availability[s.key] = serviceStatus[normalizeServiceKey(s.key)] !== false;
    }
    return availability;
  }, [services, serviceStatus]);

  const networks = useMemo(
    () => [
      { key: "mtn" as const, title: "MTN" },
      { key: "airtel" as const, title: "Airtel" },
      { key: "glo" as const, title: "Glo" },
      { key: "9mobile" as const, title: "9mobile" },
    ],
    []
  );

  const filteredPlans = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return plans;
    return plans.filter((p) => {
      const name = String(p.name || "").toLowerCase();
      const validity = String(p.validity || "").toLowerCase();
      const cat = String(p.category || "").toLowerCase();
      return name.includes(q) || validity.includes(q) || cat.includes(q);
    });
  }, [plans, filterText]);

  const loadPlans = async () => {
    if (serviceType !== "data") {
      toast.toast({
        title: "Not available",
        description:
          "This simplified pricing screen is currently available for data plans only.",
        variant: "destructive",
      });
      return;
    }
    if (!network.trim() || !category.trim()) {
      toast.toast({
        title: "Missing fields",
        description: "Select a network and category",
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
      setPlans(Array.isArray(rows) ? rows : []);
      const nextEdits: Record<string, string> = {};
      for (const p of rows) {
        const current =
          typeof p.sellingPrice === "number"
            ? p.sellingPrice
            : typeof p.basePrice === "number"
              ? p.basePrice
              : null;
        nextEdits[String(p.planId)] = current === null ? "" : String(current);
      }
      setPriceEdits(nextEdits);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
      setPlans([]);
      setPriceEdits({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPlans([]);
    setPriceEdits({});
    setFilterText("");
  }, [serviceType, network, category, scope, selectedUserId]);

  useEffect(() => {
    if (serviceType !== "data") {
      if (step !== 1) setStep(1);
      return;
    }
    if (step === 3 && !network) setStep(2);
    if (step === 2 && serviceType !== "data") setStep(1);
  }, [serviceType, network, step]);

  useEffect(() => {
    if (!user || !isMerchant) return;
    if (serviceAvailability[serviceType] === false) {
      setServiceType("data");
      setStep(1);
    }
    if (serviceType !== "data") return;
    if (!network || !category.trim()) return;
    if (scope === "user" && !selectedUserId) return;
    loadPlans();
  }, [user, isMerchant, serviceType, network, category, scope, selectedUserId, serviceAvailability]);

  const savePlanPrice = async (plan: CatalogPlan) => {
    if (serviceType !== "data") return;
    const planId = String(plan.planId);
    const raw = String(priceEdits[planId] ?? "").trim();
    const n = Number(raw);
    if (!Number.isFinite(n)) {
      toast.toast({
        title: "Invalid price",
        description: "Enter a valid number",
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
    setSavingPlanId(planId);
    try {
      const path =
        scope === "user"
          ? `/tenants/users/${encodeURIComponent(selectedUserId)}/pricing/plans`
          : "/tenants/pricing/plans";
      await axiosInstance.put(path, {
        items: [{ planId, pricingType: "fixed", value: n, active: true }],
      });
      toast.toast({ title: "Updated", description: "Pricing updated successfully" });
      await loadPlans();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setSavingPlanId("");
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
            <p className="text-muted-foreground">
              Service → Network → Plans. Set your selling price per plan.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pricing flow</CardTitle>
              <CardDescription>
                Pick what you sell, then quickly update plan prices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Step <span className="font-semibold text-foreground">{step}</span>{" "}
                  of 3
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setStep((s) => (s === 1 ? 1 : ((s - 1) as any)))
                    }
                    disabled={step === 1}
                  >
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep((s) => (s === 1 ? 2 : 3))}
                      disabled={
                        (step === 1 && serviceType !== "data") ||
                        (step === 2 && !network)
                      }
                    >
                      Continue
                    </Button>
                  ) : null}
                </div>
              </div>

              {step === 1 ? (
                <div className="space-y-3">
                  <Label>1) Choose service</Label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {services.map((s) => {
                      const active = serviceType === s.key;
                      const normalizedKey = normalizeServiceKey(s.key);
                      const hasKnownStatus = Object.prototype.hasOwnProperty.call(serviceStatus, normalizedKey);
                      const isOff = serviceAvailability[s.key] === false;
                      const isSupported = s.key === "data";
                      const disabled = isOff;
                      return (
                        <button
                          key={s.key}
                          type="button"
                          onClick={() => {
                            if (isOff) return;
                            setServiceType(s.key);
                            if (s.key === "data") {
                              setStep(2);
                              return;
                            }
                            toast.toast({
                              title: "Coming soon",
                              description: "Pricing management is currently available for data plans only.",
                            });
                          }}
                          disabled={disabled}
                          className={`rounded-lg border p-4 text-left transition ${
                            active
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/40"
                          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="font-semibold">{s.title}</div>
                            {hasKnownStatus && isOff ? (
                              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                                Off
                              </span>
                            ) : !isSupported ? (
                              <span className="rounded-full bg-white/50 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                Soon
                              </span>
                            ) : null}
                          </div>
                          <div className="text-sm text-muted-foreground">{s.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-3">
                  <div className="flex items-end justify-between gap-3">
                    <div>
                      <Label>2) Choose network</Label>
                      <div className="text-sm text-muted-foreground">
                        Pick a network to load plans.
                      </div>
                    </div>
                    <Button variant="outline" onClick={() => setStep(1)}>
                      Change service
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {networks.map((n) => {
                      const active = network === n.key;
                      return (
                        <button
                          key={n.key}
                          type="button"
                          onClick={() => {
                            setNetwork(n.key);
                            setStep(3);
                          }}
                          className={`rounded-lg border p-4 text-left transition ${
                            active
                              ? "border-primary bg-primary/5"
                              : "border-border hover:bg-muted/40"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-14 overflow-hidden rounded-md border bg-white">
                              <img
                                src={`/images/${n.key}.svg`}
                                alt={n.title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-semibold">{n.title}</div>
                              <div className="text-xs text-muted-foreground">Data plans</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="space-y-6">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                      Editing{" "}
                      <span className="font-semibold text-foreground">
                        {String(network).toUpperCase()}
                      </span>{" "}
                      / <span className="font-semibold text-foreground">{category}</span>
                    </div>
                    <Button variant="outline" onClick={() => setStep(2)}>
                      Change network
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={category} onValueChange={setCategory} disabled={!network}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categoryOptions.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Search plans</Label>
                      <Input
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        placeholder="e.g. 500MB, 1GB, 30 days"
                      />
                    </div>
                    <div className="flex items-end gap-2">
                      <Button
                        variant="outline"
                        onClick={loadPlans}
                        disabled={
                          loading ||
                          !network ||
                          !category.trim() ||
                          (scope === "user" && !selectedUserId)
                        }
                      >
                        {loading ? "Loading..." : "Reload plans"}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg border">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/20">
                          <TableHead>Plan</TableHead>
                          <TableHead>Validity</TableHead>
                          <TableHead>Our price</TableHead>
                          <TableHead>Your price</TableHead>
                          <TableHead className="text-right">Update</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-sm text-muted-foreground">
                              Loading plans...
                            </TableCell>
                          </TableRow>
                        ) : !plans.length ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-sm text-muted-foreground">
                              No plans found for {String(network).toUpperCase()} / {category}. Try another category.
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPlans.map((p) => {
                            const id = String(p.planId);
                            const base = typeof p.basePrice === "number" ? p.basePrice : null;
                            const sell = typeof p.sellingPrice === "number" ? p.sellingPrice : null;
                            const edit = priceEdits[id] ?? "";
                            return (
                              <TableRow key={id}>
                                <TableCell>
                                  <div className="font-medium">{p.name}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {p.network}
                                    {p.category ? ` • ${p.category}` : ""}
                                  </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                  {p.validity || "-"}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {base === null ? "-" : `₦${base}`}
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-col gap-1">
                                    <Input
                                      value={edit}
                                      onChange={(e) =>
                                        setPriceEdits((prev) => ({
                                          ...prev,
                                          [id]: e.target.value,
                                        }))
                                      }
                                      placeholder={sell === null ? "Enter price" : String(sell)}
                                    />
                                    <div className="text-xs text-muted-foreground">
                                      Current: {sell === null ? "-" : `₦${sell}`}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    onClick={() => savePlanPrice(p)}
                                    disabled={savingPlanId === id || (scope === "user" && !selectedUserId)}
                                  >
                                    {savingPlanId === id ? "Updating..." : "Update"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

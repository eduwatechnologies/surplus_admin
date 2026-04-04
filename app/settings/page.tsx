"use client";

import { useEffect, useMemo, useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommissionSettings } from "@/components/commission-settings";
import { ServiceSettings } from "@/components/service-settings";
import { GeneralSettings } from "@/components/general-settings";
import { Cog, Percent, Server, ShieldCheck } from "lucide-react";
import { ApiSettings } from "@/components/api-settings";
import { useAuth } from "@/components/providers/auth-provider";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TenantProfile = {
  slug: string;
  status: string;
  brandName: string | null;
  logoUrl: string | null;
  primaryColor: string | null;
  supportEmail: string | null;
  supportPhone: string | null;
  disabledServices?: string[];
  riskSettings?: {
    pinRequired?: boolean;
    velocityWindowMinutes?: number;
    velocityMaxTx?: number;
    dailyAmountLimitUnverified?: number | null;
    dailyTxLimitUnverified?: number | null;
    dailyAmountLimitVerified?: number | null;
    dailyTxLimitVerified?: number | null;
    kycRequiredAbove?: number | null;
    alerts?: {
      failedTransactions?: boolean;
      email?: boolean;
    };
  };
};

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
  override: PricingOverride | null;
};

type PlanEdit = {
  pricingType: PricingOverride["pricingType"];
  value: string;
  active: boolean;
  dirty: boolean;
};

type RiskSettingsForm = {
  pinRequired: boolean;
  velocityWindowMinutes: string;
  velocityMaxTx: string;
  dailyAmountLimitUnverified: string;
  dailyTxLimitUnverified: string;
  dailyAmountLimitVerified: string;
  dailyTxLimitVerified: string;
  kycRequiredAbove: string;
  alertsFailedTransactions: boolean;
  alertsEmail: boolean;
};

type AuditLogRow = {
  _id: string;
  timestamp: string;
  module?: string;
  action?: string;
  actorName?: string | null;
  description?: string | null;
  ipAddress?: string | null;
};

function MerchantOnboarding() {
  const toast = useToast();
  const { user, setAuth } = useAuth();
  const [slug, setSlug] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const createMerchant = async () => {
    if (!slug.trim()) {
      toast.toast({ title: "Missing slug", description: "Slug is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const res = await axiosInstance.post("/tenants/onboard", {
        slug,
        brandName,
        logoUrl,
        primaryColor,
        supportEmail,
        supportPhone,
      });

      const accessToken = res.data?.accessToken as string | undefined;
      const nextUser = res.data?.user as { id?: string; email?: string; role?: string } | undefined;

      if (!accessToken || !nextUser?.id) throw new Error("Invalid response from server");

      setAuth({
        user: {
          id: nextUser.id,
          name: nextUser.email || user?.email || "Merchant",
          email: nextUser.email || user?.email || "",
          role: nextUser.role || "merchant",
        },
        token: accessToken,
      });

      toast.toast({ title: "Created", description: "Merchant profile created successfully" });
      window.location.href = "/settings";
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Become a Merchant</h1>
        <p className="text-muted-foreground mt-1">
          Create your merchant profile to get a branded storefront and set your own pricing.
        </p>
      </div>

      <div className="rounded-lg border bg-background p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Your slug becomes your link: <span className="font-medium text-foreground">{slug ? `${slug}.yourdomain.com` : "your-slug.yourdomain.com"}</span>
          </div>
          <Button onClick={createMerchant} disabled={saving}>
            {saving ? "Creating..." : "Create Merchant"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Slug</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="almaleek" />
          </div>
          <div className="space-y-2">
            <Label>Brand Name</Label>
            <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Almaleek" />
          </div>
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#2563eb" />
          </div>
          <div className="space-y-2">
            <Label>Logo URL</Label>
            <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div className="space-y-2">
            <Label>Support Email</Label>
            <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@domain.com" />
          </div>
          <div className="space-y-2">
            <Label>Support Phone</Label>
            <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder="080..." />
          </div>
        </div>
      </div>
    </main>
  );
}

function MerchantSettings() {
  const toast = useToast();
  const [tenant, setTenant] = useState<TenantProfile | null>(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [tenantSaving, setTenantSaving] = useState(false);
  const [tenantError, setTenantError] = useState<string | null>(null);

  const [brandName, setBrandName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [disabledServices, setDisabledServices] = useState<string[]>([]);
  const [riskForm, setRiskForm] = useState<RiskSettingsForm>({
    pinRequired: false,
    velocityWindowMinutes: "2",
    velocityMaxTx: "6",
    dailyAmountLimitUnverified: "",
    dailyTxLimitUnverified: "",
    dailyAmountLimitVerified: "",
    dailyTxLimitVerified: "",
    kycRequiredAbove: "",
    alertsFailedTransactions: false,
    alertsEmail: false,
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditModule, setAuditModule] = useState("");
  const [auditAction, setAuditAction] = useState("");

  const [network, setNetwork] = useState("");
  const [category, setCategory] = useState("");
  const [plans, setPlans] = useState<CatalogPlan[]>([]);
  const [planEdits, setPlanEdits] = useState<Record<string, PlanEdit>>({});
  const [plansLoading, setPlansLoading] = useState(false);
  const [plansSaving, setPlansSaving] = useState(false);

  const dirtyCount = useMemo(
    () => Object.values(planEdits).filter((e) => e.dirty).length,
    [planEdits]
  );

  useEffect(() => {
    let mounted = true;
    setTenantLoading(true);
    setTenantError(null);
    axiosInstance
      .get("/tenants/me")
      .then((res) => {
        if (!mounted) return;
        const t = res.data?.data as TenantProfile;
        setTenant(t);
        setBrandName(t?.brandName || "");
        setLogoUrl(t?.logoUrl || "");
        setPrimaryColor(t?.primaryColor || "");
        setSupportEmail(t?.supportEmail || "");
        setSupportPhone(t?.supportPhone || "");
        setDisabledServices(Array.isArray(t?.disabledServices) ? t.disabledServices : []);
        const rs = t?.riskSettings || {};
        setRiskForm({
          pinRequired: rs?.pinRequired === true,
          velocityWindowMinutes:
            typeof rs.velocityWindowMinutes === "number" && Number.isFinite(rs.velocityWindowMinutes)
              ? String(rs.velocityWindowMinutes)
              : "2",
          velocityMaxTx:
            typeof rs.velocityMaxTx === "number" && Number.isFinite(rs.velocityMaxTx)
              ? String(rs.velocityMaxTx)
              : "6",
          dailyAmountLimitUnverified:
            rs.dailyAmountLimitUnverified === null || typeof rs.dailyAmountLimitUnverified === "undefined"
              ? ""
              : String(rs.dailyAmountLimitUnverified),
          dailyTxLimitUnverified:
            rs.dailyTxLimitUnverified === null || typeof rs.dailyTxLimitUnverified === "undefined"
              ? ""
              : String(rs.dailyTxLimitUnverified),
          dailyAmountLimitVerified:
            rs.dailyAmountLimitVerified === null || typeof rs.dailyAmountLimitVerified === "undefined"
              ? ""
              : String(rs.dailyAmountLimitVerified),
          dailyTxLimitVerified:
            rs.dailyTxLimitVerified === null || typeof rs.dailyTxLimitVerified === "undefined"
              ? ""
              : String(rs.dailyTxLimitVerified),
          kycRequiredAbove:
            rs.kycRequiredAbove === null || typeof rs.kycRequiredAbove === "undefined"
              ? ""
              : String(rs.kycRequiredAbove),
          alertsFailedTransactions: rs.alerts?.failedTransactions === true,
          alertsEmail: rs.alerts?.email === true,
        });
      })
      .catch((err) => {
        if (!mounted) return;
        const msg =
          err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
        setTenantError(msg);
      })
      .finally(() => {
        if (!mounted) return;
        setTenantLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const saveTenant = async () => {
    setTenantSaving(true);
    try {
      const parseIntField = (raw: string) => {
        const n = Number(raw);
        if (!Number.isFinite(n)) return null;
        return Math.trunc(n);
      };
      const parseNumOrNull = (raw: string) => {
        const trimmed = String(raw || "").trim();
        if (!trimmed) return null;
        const n = Number(trimmed);
        if (!Number.isFinite(n)) return null;
        return n;
      };

      const velocityWindowMinutes = parseIntField(riskForm.velocityWindowMinutes);
      const velocityMaxTx = parseIntField(riskForm.velocityMaxTx);
      if (!velocityWindowMinutes || velocityWindowMinutes < 1 || velocityWindowMinutes > 60) {
        toast.toast({
          title: "Invalid risk settings",
          description: "Velocity window must be between 1 and 60 minutes",
          variant: "destructive",
        });
        return;
      }
      if (!velocityMaxTx || velocityMaxTx < 1 || velocityMaxTx > 100) {
        toast.toast({
          title: "Invalid risk settings",
          description: "Max transactions must be between 1 and 100",
          variant: "destructive",
        });
        return;
      }

      const res = await axiosInstance.put("/tenants/me", {
        brandName,
        logoUrl,
        primaryColor,
        supportEmail,
        supportPhone,
        disabledServices,
        riskSettings: {
          pinRequired: riskForm.pinRequired,
          velocityWindowMinutes,
          velocityMaxTx,
          dailyAmountLimitUnverified: parseNumOrNull(riskForm.dailyAmountLimitUnverified),
          dailyTxLimitUnverified: parseNumOrNull(riskForm.dailyTxLimitUnverified),
          dailyAmountLimitVerified: parseNumOrNull(riskForm.dailyAmountLimitVerified),
          dailyTxLimitVerified: parseNumOrNull(riskForm.dailyTxLimitVerified),
          kycRequiredAbove: parseNumOrNull(riskForm.kycRequiredAbove),
          alerts: {
            failedTransactions: riskForm.alertsFailedTransactions,
            email: riskForm.alertsEmail,
          },
        },
      });
      const t = res.data?.data as TenantProfile;
      setTenant(t);
      setDisabledServices(Array.isArray(t?.disabledServices) ? t.disabledServices : disabledServices);
      const rs = t?.riskSettings || {};
      setRiskForm((prev) => ({
        ...prev,
        pinRequired: rs?.pinRequired === true,
        velocityWindowMinutes:
          typeof rs.velocityWindowMinutes === "number" && Number.isFinite(rs.velocityWindowMinutes)
            ? String(rs.velocityWindowMinutes)
            : prev.velocityWindowMinutes,
        velocityMaxTx:
          typeof rs.velocityMaxTx === "number" && Number.isFinite(rs.velocityMaxTx)
            ? String(rs.velocityMaxTx)
            : prev.velocityMaxTx,
        dailyAmountLimitUnverified:
          rs.dailyAmountLimitUnverified === null || typeof rs.dailyAmountLimitUnverified === "undefined"
            ? ""
            : String(rs.dailyAmountLimitUnverified),
        dailyTxLimitUnverified:
          rs.dailyTxLimitUnverified === null || typeof rs.dailyTxLimitUnverified === "undefined"
            ? ""
            : String(rs.dailyTxLimitUnverified),
        dailyAmountLimitVerified:
          rs.dailyAmountLimitVerified === null || typeof rs.dailyAmountLimitVerified === "undefined"
            ? ""
            : String(rs.dailyAmountLimitVerified),
        dailyTxLimitVerified:
          rs.dailyTxLimitVerified === null || typeof rs.dailyTxLimitVerified === "undefined"
            ? ""
            : String(rs.dailyTxLimitVerified),
        kycRequiredAbove:
          rs.kycRequiredAbove === null || typeof rs.kycRequiredAbove === "undefined"
            ? ""
            : String(rs.kycRequiredAbove),
        alertsFailedTransactions: rs.alerts?.failedTransactions === true,
        alertsEmail: rs.alerts?.email === true,
      }));
      toast.toast({ title: "Saved", description: "Branding updated successfully" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setTenantSaving(false);
    }
  };

  const loadAuditLogs = async () => {
    setAuditLoading(true);
    try {
      const res = await axiosInstance.get("/tenants/audit-logs", {
        params: {
          module: auditModule.trim() ? auditModule.trim() : undefined,
          action: auditAction.trim() ? auditAction.trim() : undefined,
        },
      });
      const rows = (res.data?.data || []) as AuditLogRow[];
      setAuditLogs(rows);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setAuditLoading(false);
    }
  };

  const loadPlans = async () => {
    if (!network.trim() || !category.trim()) {
      toast.toast({
        title: "Missing fields",
        description: "Network and category are required",
        variant: "destructive",
      });
      return;
    }
    setPlansLoading(true);
    try {
      const res = await axiosInstance.get("/tenants/pricing/catalog", {
        params: { network, category },
      });
      const rows = (res.data?.data || []) as CatalogPlan[];
      setPlans(rows);
      const nextEdits: Record<string, PlanEdit> = {};
      for (const p of rows) {
        const existing = p.override;
        nextEdits[String(p.planId)] = {
          pricingType: existing?.pricingType || "flat_markup",
          value:
            typeof existing?.value === "number" && Number.isFinite(existing.value)
              ? String(existing.value)
              : "",
          active: typeof existing?.active === "boolean" ? existing.active : true,
          dirty: false,
        };
      }
      setPlanEdits(nextEdits);
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setPlansLoading(false);
    }
  };

  const savePlanOverrides = async () => {
    const items = Object.entries(planEdits)
      .filter(([, e]) => e.dirty)
      .map(([planId, e]) => {
        const v = Number(e.value);
        if (!Number.isFinite(v)) return null;
        return { planId, pricingType: e.pricingType, value: v, active: e.active };
      })
      .filter(Boolean) as Array<{
      planId: string;
      pricingType: PricingOverride["pricingType"];
      value: number;
      active: boolean;
    }>;

    if (!items.length) {
      toast.toast({ title: "No changes", description: "Nothing to save" });
      return;
    }

    setPlansSaving(true);
    try {
      await axiosInstance.put("/tenants/pricing/plans", { items });
      toast.toast({ title: "Saved", description: "Pricing updated successfully" });
      await loadPlans();
    } catch (err: any) {
      const msg =
        err?.response?.data?.error || err?.response?.data?.message || err?.message || "Failed";
      toast.toast({ title: "Failed", description: msg, variant: "destructive" });
    } finally {
      setPlansSaving(false);
    }
  };

  return (
    <main className="flex-1 p-6 md:p-8 space-y-8 bg-muted/20 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Merchant Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your merchant branding and pricing.
        </p>
      </div>

      {tenantLoading ? (
        <div className="text-sm text-muted-foreground">Loading merchant profile...</div>
      ) : tenantError ? (
        <div className="p-4 rounded-md border border-red-200 bg-red-50 text-sm text-red-700">
          {tenantError}
        </div>
      ) : (
        <Tabs defaultValue="branding" className="space-y-6">
          <div className="border-b pb-0 overflow-x-auto">
            <TabsList className="bg-transparent h-auto p-0 space-x-6 justify-start w-full">
              <TabsTrigger
                value="branding"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
              >
                Branding
              </TabsTrigger>
              <TabsTrigger
                value="services"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
              >
                Services
              </TabsTrigger>
              <TabsTrigger
                value="risk"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
              >
                Risk & Limits
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
              >
                Pricing
              </TabsTrigger>
              <TabsTrigger
                value="audit"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
              >
                Audit Logs
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="branding" className="animate-in fade-in-50 duration-300">
            <div className="rounded-lg border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Branding</div>
                  <div className="text-sm text-muted-foreground">
                    Slug: {tenant?.slug || "-"}
                  </div>
                </div>
                <Button onClick={saveTenant} disabled={tenantSaving}>
                  {tenantSaving ? "Saving..." : "Save Branding"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    placeholder="#2563eb"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Support Email</Label>
                  <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Support Phone</Label>
                  <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="services" className="animate-in fade-in-50 duration-300">
            <div className="rounded-lg border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Service Availability</div>
                  <div className="text-sm text-muted-foreground">
                    Disable any service to hide it from your storefront and block purchases.
                  </div>
                </div>
                <Button onClick={saveTenant} disabled={tenantSaving}>
                  {tenantSaving ? "Saving..." : "Save Availability"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "airtime", label: "Airtime" },
                  { key: "data", label: "Data" },
                  { key: "electricity", label: "Electricity" },
                  { key: "cable_tv", label: "Cable TV" },
                  { key: "exam_pin", label: "Exam PIN" },
                ].map((s) => {
                  const enabled = !disabledServices.includes(s.key);
                  return (
                    <div key={s.key} className="flex items-center justify-between rounded-md border p-3">
                      <div className="text-sm font-medium">{s.label}</div>
                      <Switch
                        checked={enabled}
                        onCheckedChange={(checked) =>
                          setDisabledServices((prev) => {
                            const set = new Set(prev);
                            if (checked) set.delete(s.key);
                            else set.add(s.key);
                            return Array.from(set);
                          })
                        }
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="risk" className="animate-in fade-in-50 duration-300">
            <div className="rounded-lg border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Risk & Limits</div>
                  <div className="text-sm text-muted-foreground">
                    Configure PIN requirement, velocity checks, KYC threshold, and daily limits.
                  </div>
                </div>
                <Button onClick={saveTenant} disabled={tenantSaving}>
                  {tenantSaving ? "Saving..." : "Save Risk Settings"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Require Transaction PIN</div>
                    <div className="text-xs text-muted-foreground">Always prompt for PIN on purchases.</div>
                  </div>
                  <Switch
                    checked={riskForm.pinRequired}
                    onCheckedChange={(checked) => setRiskForm((p) => ({ ...p, pinRequired: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Failed Tx Alerts</div>
                    <div className="text-xs text-muted-foreground">Logically enables sending alerts for failed purchases.</div>
                  </div>
                  <Switch
                    checked={riskForm.alertsFailedTransactions}
                    onCheckedChange={(checked) =>
                      setRiskForm((p) => ({ ...p, alertsFailedTransactions: checked }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Velocity Window (minutes)</Label>
                  <Input
                    value={riskForm.velocityWindowMinutes}
                    onChange={(e) => setRiskForm((p) => ({ ...p, velocityWindowMinutes: e.target.value }))}
                    placeholder="2"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Max Transactions per Window</Label>
                  <Input
                    value={riskForm.velocityMaxTx}
                    onChange={(e) => setRiskForm((p) => ({ ...p, velocityMaxTx: e.target.value }))}
                    placeholder="6"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Daily Amount Limit (Unverified)</Label>
                  <Input
                    value={riskForm.dailyAmountLimitUnverified}
                    onChange={(e) =>
                      setRiskForm((p) => ({ ...p, dailyAmountLimitUnverified: e.target.value }))
                    }
                    placeholder="Leave empty for no limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily Tx Limit (Unverified)</Label>
                  <Input
                    value={riskForm.dailyTxLimitUnverified}
                    onChange={(e) => setRiskForm((p) => ({ ...p, dailyTxLimitUnverified: e.target.value }))}
                    placeholder="Leave empty for no limit"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Daily Amount Limit (Verified)</Label>
                  <Input
                    value={riskForm.dailyAmountLimitVerified}
                    onChange={(e) => setRiskForm((p) => ({ ...p, dailyAmountLimitVerified: e.target.value }))}
                    placeholder="Leave empty for no limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Daily Tx Limit (Verified)</Label>
                  <Input
                    value={riskForm.dailyTxLimitVerified}
                    onChange={(e) => setRiskForm((p) => ({ ...p, dailyTxLimitVerified: e.target.value }))}
                    placeholder="Leave empty for no limit"
                  />
                </div>

                <div className="space-y-2">
                  <Label>KYC Required Above (amount)</Label>
                  <Input
                    value={riskForm.kycRequiredAbove}
                    onChange={(e) => setRiskForm((p) => ({ ...p, kycRequiredAbove: e.target.value }))}
                    placeholder="Leave empty to disable"
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Alert via Email</div>
                    <div className="text-xs text-muted-foreground">Requires backend email delivery setup.</div>
                  </div>
                  <Switch
                    checked={riskForm.alertsEmail}
                    onCheckedChange={(checked) => setRiskForm((p) => ({ ...p, alertsEmail: checked }))}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="animate-in fade-in-50 duration-300">
            <div className="rounded-lg border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Pricing</div>
                  <div className="text-sm text-muted-foreground">
                    Load plans by network + category, then set overrides.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={loadPlans} disabled={plansLoading}>
                    {plansLoading ? "Loading..." : "Load Plans"}
                  </Button>
                  <Button onClick={savePlanOverrides} disabled={plansSaving || dirtyCount === 0}>
                    {plansSaving ? "Saving..." : `Save Changes (${dirtyCount})`}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Network</Label>
                  <Input
                    value={network}
                    onChange={(e) => setNetwork(e.target.value)}
                    placeholder="mtn or 01"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="SME"
                  />
                </div>
              </div>

              {plans.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Plan</TableHead>
                        <TableHead className="text-right">Base</TableHead>
                        <TableHead className="text-right">Selling</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead className="text-center">Active</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {plans.map((p) => {
                        const edit = planEdits[String(p.planId)];
                        return (
                          <TableRow key={String(p.planId)}>
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span>{p.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {p.serviceType} • {p.category || "-"} • {p.network}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {typeof p.basePrice === "number" ? p.basePrice : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              {typeof p.sellingPrice === "number" ? p.sellingPrice : "-"}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={edit?.pricingType || "flat_markup"}
                                onValueChange={(v) =>
                                  setPlanEdits((prev) => ({
                                    ...prev,
                                    [String(p.planId)]: {
                                      ...(prev[String(p.planId)] || {
                                        pricingType: "flat_markup",
                                        value: "",
                                        active: true,
                                        dirty: false,
                                      }),
                                      pricingType: v as any,
                                      dirty: true,
                                    },
                                  }))
                                }
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="flat_markup">Flat Markup</SelectItem>
                                  <SelectItem value="percent_markup">Percent Markup</SelectItem>
                                  <SelectItem value="fixed">Fixed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Input
                                className="w-[120px] text-right"
                                value={edit?.value || ""}
                                onChange={(e) =>
                                  setPlanEdits((prev) => ({
                                    ...prev,
                                    [String(p.planId)]: {
                                      ...(prev[String(p.planId)] || {
                                        pricingType: "flat_markup",
                                        value: "",
                                        active: true,
                                        dirty: false,
                                      }),
                                      value: e.target.value,
                                      dirty: true,
                                    },
                                  }))
                                }
                                placeholder="0"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              <Switch
                                checked={Boolean(edit?.active)}
                                onCheckedChange={(checked) =>
                                  setPlanEdits((prev) => ({
                                    ...prev,
                                    [String(p.planId)]: {
                                      ...(prev[String(p.planId)] || {
                                        pricingType: "flat_markup",
                                        value: "",
                                        active: true,
                                        dirty: false,
                                      }),
                                      active: checked,
                                      dirty: true,
                                    },
                                  }))
                                }
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">
                  No plans loaded yet.
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="audit" className="animate-in fade-in-50 duration-300">
            <div className="rounded-lg border bg-background p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">Audit Logs</div>
                  <div className="text-sm text-muted-foreground">
                    Track changes to pricing/settings and customer actions done by staff.
                  </div>
                </div>
                <Button variant="outline" onClick={loadAuditLogs} disabled={auditLoading}>
                  {auditLoading ? "Loading..." : "Load Logs"}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Module (optional)</Label>
                  <Input value={auditModule} onChange={(e) => setAuditModule(e.target.value)} placeholder="pricing" />
                </div>
                <div className="space-y-2">
                  <Label>Action (optional)</Label>
                  <Input value={auditAction} onChange={(e) => setAuditAction(e.target.value)} placeholder="tenant.update" />
                </div>
              </div>

              {auditLogs.length ? (
                <div className="rounded-md border overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Time</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Actor</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {auditLogs.map((r) => (
                        <TableRow key={r._id}>
                          <TableCell className="whitespace-nowrap">
                            {r.timestamp ? new Date(r.timestamp).toLocaleString() : "-"}
                          </TableCell>
                          <TableCell>{r.module || "-"}</TableCell>
                          <TableCell>{r.action || "-"}</TableCell>
                          <TableCell>{r.actorName || "-"}</TableCell>
                          <TableCell className="max-w-[520px] truncate">{r.description || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">No logs loaded.</div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </main>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const isMerchant = user?.role === "merchant" || user?.role === "reseller";
  const isUser = user?.role === "user";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        {isMerchant ? (
          <MerchantSettings />
        ) : isUser ? (
          <MerchantOnboarding />
        ) : (
        <main className="flex-1 p-6 md:p-8 space-y-8 bg-muted/20 min-h-screen">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your VTU platform configuration, commissions, and services.
              </p>
            </div>
          </div>

          <Tabs defaultValue="commissions" className="space-y-6">
            <div className="border-b pb-0 overflow-x-auto">
              <TabsList className="bg-transparent h-auto p-0 space-x-6 justify-start w-full">
                <TabsTrigger 
                  value="commissions" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span>Commissions</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    <span>Services</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="api" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>API Settings</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger 
                  value="general" 
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none pb-3 px-1"
                >
                   <div className="flex items-center gap-2">
                    <Cog className="h-4 w-4" />
                    <span>General</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="commissions" className="animate-in fade-in-50 duration-300 space-y-6">
              <CommissionSettings />
            </TabsContent>

            <TabsContent value="services" className="animate-in fade-in-50 duration-300 space-y-6">
              <ServiceSettings />
            </TabsContent>

            <TabsContent value="api" className="animate-in fade-in-50 duration-300 space-y-6">
               <ApiSettings />
            </TabsContent>

            <TabsContent value="general" className="animate-in fade-in-50 duration-300 space-y-6">
              <GeneralSettings />
            </TabsContent>
          </Tabs>
        </main>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}

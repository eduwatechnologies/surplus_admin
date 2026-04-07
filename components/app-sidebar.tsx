"use client";

import {
  BarChart3,
  Bell,
  CreditCard,
  DollarSign,
  Home,
  Settings,
  Users,
  Wifi,
  Wallet,
  LogOut,
  ChevronDown,
  HelpCircle,
  FileText,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useAuth } from "@/components/providers/auth-provider";

function useBranding(role?: string) {
  const [name, setName] = useState(process.env.NEXT_PUBLIC_BRAND_NAME || "SURPLUS");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    const isMerchant = role === "merchant" || role === "reseller";
    const path = isMerchant ? "/tenants/me" : "/config/branding";
    axiosInstance
      .get(path)
      .then((res) => {
        if (!mounted) return;
        const d = res.data?.data || {};
        const brandName = d.brandName || d.slug;
        if (brandName && typeof brandName === "string" && brandName.trim()) {
          setName(brandName);
        }
        if (typeof d.logoUrl === "string") setLogoUrl(d.logoUrl || null);
        if (typeof d.primaryColor === "string") setPrimaryColor(d.primaryColor || null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [role]);
  return { name, logoUrl, primaryColor };
}

// Define menu structure with categories
const staffMenuGroups = [
  {
    label: "DASHBOARD",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    label: "COLLECTIONS",
    items: [
      {
        title: "Transactions",
        url: "/transactions",
        icon: CreditCard,
      },
    
    ],
  },
  {
    label: "MANAGEMENT",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Services",
        url: "/services",
        icon: Wifi,
      },
     
  
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Logs",
        url: "/logs",
        icon: BarChart3,
      },
      {
        title: "Notifications",
        url: "/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

const merchantMenuGroups = [
  {
    label: "OVERVIEW",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: Home,
      },
    ],
  },
  {
    label: "SALES",
    items: [
      {
        title: "Transactions",
        url: "/merchant-transactions",
        icon: CreditCard,
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
      },
      {
        title: "Wallet",
        url: "/wallet",
        icon: Wallet,
      },
    ],
  },
  {
    label: "PRICING",
    items: [
      {
        title: "Pricing",
        url: "/pricing",
        icon: DollarSign,
      },
    ],
  },
  {
    label: "SETTINGS",
    items: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role;
  const isMerchant = role === "merchant" || role === "reseller";
  const { name: BRAND_NAME, logoUrl, primaryColor } = useBranding(role);
  const BRAND_INITIAL = (BRAND_NAME.trim()[0] || "A").toUpperCase();
  const menuGroups = isMerchant ? merchantMenuGroups : staffMenuGroups;
  const sidebarBrandColor = primaryColor || "var(--brand-600)";

  const onLogout = () => {
    console.log("User logged out");
    // window.location.href = '/login';
  };

  return (
    <Sidebar
      className="w-64 h-screen border-r border-slate-200 bg-white/70 text-slate-800 backdrop-blur"
      style={{ ["--sidebar-brand" as any]: sidebarBrandColor } as React.CSSProperties}
    >
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-[color:var(--sidebar-brand)] opacity-80" />
      <SidebarHeader className="px-6 py-6 border-b border-slate-200 bg-white/60 backdrop-blur">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm overflow-hidden border border-slate-200">
              <img src={logoUrl} alt={BRAND_NAME} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow-sm brand-bg"
              style={primaryColor ? { backgroundColor: primaryColor } : undefined}
            >
              <span className="font-bold text-xl">{BRAND_INITIAL}</span>
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900 tracking-wide">
                {BRAND_NAME}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <span className="text-xs font-medium">Dashboard</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-3 scrollbar-none">
        {menuGroups.map((group, index) => (
          <div key={group.label} className={cn("mb-6", index === 0 && "mt-2")}>
            <h3 className="mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {group.label}
            </h3>
            <SidebarMenu>
              {group.items.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive} className="ring-offset-transparent focus-visible:ring-0">
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                          isActive
                            ? "bg-[color:var(--brand-50)] text-slate-900"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r bg-[color:var(--sidebar-brand)]" />
                        )}
                        <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "brand-text" : "text-slate-500 group-hover:text-slate-700")} />
                        <span>{item.title}</span>
                        {isActive && (
                          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[color:var(--sidebar-brand)]" />
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-6 py-6 mt-auto border-t border-slate-200 bg-white/60 backdrop-blur">
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start gap-3 text-sm font-medium text-slate-700 hover:text-red-600 hover:bg-red-50 transition-all rounded-lg h-11"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

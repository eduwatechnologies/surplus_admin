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
  const [name, setName] = useState(process.env.NEXT_PUBLIC_BRAND_NAME || "ALMALEEK");
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
      {
        title: "Payments",
        url: "/payment",
        icon: Wallet,
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
      {
        title: "Network Providers",
        url: "/networkProvider",
        icon: DollarSign,
        requiresProviderManager: true,
      },
      {
        title: "Marketplace",
        url: "/marketplace",
        icon: ShoppingBag,
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

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const role = user?.role;
  const isMerchant = role === "merchant" || role === "reseller";
  const { name: BRAND_NAME, logoUrl, primaryColor } = useBranding(role);
  const BRAND_INITIAL = (BRAND_NAME.trim()[0] || "A").toUpperCase();
  const menuGroups = isMerchant
    ? [
        {
          label: "MERCHANT",
          items: [
            {
              title: "Pricing",
              url: "/pricing",
              icon: DollarSign,
            },
            {
              title: "Customers",
              url: "/customers",
              icon: Users,
            },
            {
              title: "Transactions",
              url: "/merchant-transactions",
              icon: CreditCard,
            },
            {
              title: "Wallet",
              url: "/wallet",
              icon: Wallet,
            },
            {
              title: "Settings",
              url: "/settings",
              icon: Settings,
            },
          ],
        },
      ]
    : staffMenuGroups;

  const onLogout = () => {
    console.log("User logged out");
    // window.location.href = '/login';
  };

  return (
    <Sidebar className="w-64 h-screen bg-[#0f172a] border-r border-slate-800 text-slate-300">
      {/* Header Section */}
      <SidebarHeader className="bg-[#0f172a] px-6 py-6">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-lg overflow-hidden">
              <img src={logoUrl} alt={BRAND_NAME} className="h-full w-full object-contain" />
            </div>
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg"
              style={primaryColor ? { backgroundColor: primaryColor } : undefined}
            >
              <span className="font-bold text-xl">{BRAND_INITIAL}</span>
            </div>
          )}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white tracking-wide">
                {BRAND_NAME}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <span className="text-xs font-medium">Dashboard</span>
              <ChevronDown className="h-3 w-3" />
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* Scrollable Content */}
      <SidebarContent className="px-4 py-2 bg-[#0f172a] scrollbar-none">
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
                    <SidebarMenuButton asChild isActive={isActive} className="hover:bg-slate-800 hover:text-white data-[active=true]:bg-slate-800 data-[active=true]:text-white ring-offset-transparent focus-visible:ring-0">
                      <Link
                        href={item.url}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative",
                          isActive
                            ? "bg-slate-800 text-white shadow-md"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                      >
                        <item.icon className={cn("w-5 h-5 transition-colors", isActive ? "text-indigo-400" : "text-slate-500 group-hover:text-indigo-300")} />
                        <span>{item.title}</span>
                        {isActive && (
                            <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-indigo-500" />
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

      {/* Footer Section */}
      <SidebarFooter className="bg-[#0f172a] px-6 py-6 mt-auto">
        {/* <div className="mb-6 px-2">
            <h4 className="text-white font-semibold mb-1">Need help?</h4>
            <Link href="#" className="text-sm text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Please check our docs
            </Link>
        </div> */}
        
        <SidebarMenu>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              onClick={onLogout}
              className="w-full justify-start gap-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all rounded-lg h-11"
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

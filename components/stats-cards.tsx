"use client";

import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  CreditCard,
  DollarSign,
  Smartphone,
  Users,
  Tv,
  Zap,
  Gamepad,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/lib/rbac/permissions";

import {
  OverallStats,
  ServiceBreakdown,
} from "@/lib/redux/slices/statisticSlice";

interface StatsCard {
  overall: OverallStats;
  breakdown: ServiceBreakdown[];
}

export function StatsCards({ overall, breakdown }: StatsCard) {
  const { hasPermission } = usePermissions();

  const baseStats = [
    {
      title: "Total Account Balance",
      value: `₦${overall?.totalUserBalance?.toLocaleString() || 0}`,
      change: "+12.5%",
      changeType: "increase" as const,
      icon: DollarSign,
      description: "From last month",
      requiredPermission: "perm_dashboard",
    },
    {
      title: "Total Users",
      value: overall?.totalUsers?.toLocaleString() || "0",
      change: "+8.2%",
      changeType: "increase" as const,
      icon: Users,
      description: "Active users",
      requiredPermission: "perm_users_view",
    },
    {
      title: "Successful Transactions",
      value: overall?.totalSuccessTransactions?.toLocaleString() || "0",
      change: "+23.1%",
      changeType: "increase" as const,
      icon: CheckCircle2,
      description: "This month",
      requiredPermission: "perm_transactions_view",
    },
    {
      title: "Failed Transactions",
      value: overall?.totalFailedTransactions?.toLocaleString() || "0",
      change: "-4.7%",
      changeType: "decrease" as const,
      icon: XCircle,
      description: "This month",
      requiredPermission: "perm_transactions_view",
    },
  ];

  // Map breakdown dynamically
  const serviceIcons: Record<string, any> = {
    airtime: Smartphone,
    data: Smartphone,
    tv: Tv,
    electricity: Zap,
  };

  const serviceStats = breakdown
    .filter((b) => b._id.toLowerCase() !== "wallet") // omit wallet sales
    .map((b) => ({
      title: `${b._id} Sales`,
      value: `₦${b.totalAmount?.toLocaleString() || 0}`,
      change: "-2.4%", // placeholder until you calculate real %
      changeType: "decrease" as const,
      icon: serviceIcons[b._id] || CreditCard,
      description: "From last month",
      requiredPermission: "perm_services_view",
    }));

  const stats = [...baseStats, ...serviceStats];

  // ✅ Filter stats based on permissions
  const visibleStats = stats.filter((stat) =>
    hasPermission(stat.requiredPermission)
  );

  if (visibleStats.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Welcome</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">VTU Admin</div>
            <div className="text-xs text-muted-foreground">
              Your access is limited. Contact an administrator for more
              permissions.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {visibleStats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {stat.changeType === "increase" ? (
                <ArrowUp className="mr-1 h-3 w-3 text-blue-600" />
              ) : (
                <ArrowDown className="mr-1 h-3 w-3 text-blue-600" />
              )}
              <span className="text-blue-600">{stat.change}</span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

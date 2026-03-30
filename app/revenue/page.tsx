"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { RevenueOverview } from "@/components/revenue-overview"
import { FailedTransactions } from "@/components/failed-transactions"

export default function RevenuePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Revenue Tracking</h1>
            <p className="text-muted-foreground">Monitor revenue and failed transactions</p>
          </div>

          <RevenueOverview />

          <FailedTransactions />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

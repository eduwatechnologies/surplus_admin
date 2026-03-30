"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { NotificationSettings } from "@/components/notification-settings"

export default function NotificationsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Create and manage push notifications sent to users.
            </p>
          </div>

          <NotificationSettings />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

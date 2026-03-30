"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StaffActivityLogs } from "@/components/staff/staff-activity-logs"
import { useAppDispatch } from "@/lib/redux/hooks"
import { fetchActivityLogs, fetchStaff } from "@/lib/redux/slices/staffSlice"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"

export default function ActivityLogsPage() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchActivityLogs())
    dispatch(fetchStaff())
  }, [dispatch])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground">Track all staff activity in the system</p>
          </div>

          <PermissionGuard
            requiredPermission="perm_logs_view"
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
                    Access Denied
                  </CardTitle>
                  <CardDescription>You don't have permission to view activity logs.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Please contact an administrator if you need access to this feature.</p>
                </CardContent>
              </Card>
            }
          >
            <StaffActivityLogs />
          </PermissionGuard>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

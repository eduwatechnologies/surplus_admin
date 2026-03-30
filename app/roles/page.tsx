"use client"

import { useEffect } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { RolesTable } from "@/components/staff/roles-table"
import { Button } from "@/components/ui/button"
import { useAppDispatch } from "@/lib/redux/hooks"
import { fetchRoles, fetchPermissions } from "@/lib/redux/slices/staffSlice"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { useRouter } from "next/navigation"
import { ShieldPlus } from "lucide-react"

export default function RolesPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    dispatch(fetchRoles())
    dispatch(fetchPermissions())
  }, [dispatch])

  const handleAddRole = () => {
    router.push("/roles/add")
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
              <p className="text-muted-foreground">Manage roles and permissions</p>
            </div>
            <PermissionGuard requiredPermission="perm_roles_manage" fallback={null}>
              <Button onClick={handleAddRole} className="text-white bg-blue-600 hover:bg-blue-700">
                <ShieldPlus className="mr-2 h-4 w-4" />
                Add Role
              </Button>
            </PermissionGuard>
          </div>

          <RolesTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

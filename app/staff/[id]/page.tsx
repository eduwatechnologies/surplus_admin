"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StaffActivityLogs } from "@/components/staff/staff-activity-logs"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { selectStaff, fetchActivityLogs } from "@/lib/redux/slices/staffSlice"
import { usePermissions } from "@/lib/rbac/permissions"
import { format } from "date-fns"
import { Edit, ArrowLeft } from "lucide-react"

export default function StaffDetailPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { id } = useParams()
  const { selectedStaff, roles } = useAppSelector((state) => state.staff)
  const { hasPermission } = usePermissions()

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(selectStaff(id))
      dispatch(fetchActivityLogs())
    }
  }, [dispatch, id])

  const getRoleName = (roleId: string) => {
    return roles.find((role) => role.name === roleId)?.name || "Unknown Role"
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Active</Badge>
      case "suspended":
        return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  const handleBack = () => {
    router.push("/staff")
  }

  const handleEdit = () => {
    if (selectedStaff) {
      router.push(`/staff/${selectedStaff._id}/edit`)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Staff Details</h1>
            </div>

            {hasPermission("perm_staff_manage") && selectedStaff && (
              <Button onClick={handleEdit} className="text-white bg-blue-600 hover:bg-blue-700">
                <Edit className="mr-2 h-4 w-4" />
                Edit Staff
              </Button>
            )}
          </div>

          {selectedStaff ? (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={selectedStaff.avatar || "/placeholder.svg"} alt={selectedStaff.name} />
                      <AvatarFallback className="text-2xl">{getInitials(selectedStaff.name)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedStaff.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{getRoleName(selectedStaff.role)}</Badge>
                          {getStatusBadge(selectedStaff.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>{selectedStaff.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>{selectedStaff.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Last Login</p>
                          <p>{selectedStaff.lastLogin ? format(new Date(selectedStaff.lastLogin), "PPpp") : "Never"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Created</p>
                          <p>{format(new Date(selectedStaff.createdAt), "PPpp")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="activity">
                <TabsList>
                  <TabsTrigger value="activity">Activity Log</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="activity" className="mt-4">
                  <StaffActivityLogs staffId={selectedStaff._id} />
                </TabsContent>
                <TabsContent value="permissions" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Role Permissions</CardTitle>
                      <CardDescription>
                        Permissions granted to {selectedStaff.name} through the {getRoleName(selectedStaff.role)} role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <RolePermissions roleId={selectedStaff.role} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <Card>
              <CardContent className="p-6">
                <p>Loading staff information...</p>
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function RolePermissions({ roleId }: { roleId: string }) {
  const { roles, permissions } = useAppSelector((state) => state.staff)

  const role = roles.find((r) => r.name === roleId)
  if (!role) return <p>Role not found</p>

  const rolePermissionIds = role.permissions.map((p: any) => p.id ?? p)
  const rolePermissions = permissions.filter((p) => rolePermissionIds.includes(p.id))

  // Group permissions by module
  const modulePermissions: Record<string, typeof permissions> = {}
  rolePermissions.forEach((permission) => {
    if (!modulePermissions[permission.module]) {
      modulePermissions[permission.module] = []
    }
    modulePermissions[permission.module].push(permission)
  })

  return (
    <div className="space-y-6">
      {Object.entries(modulePermissions).map(([module, perms]) => (
        <div key={module}>
          <h3 className="text-lg font-medium capitalize mb-2">{module}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {perms.map((permission) => (
              <div key={permission.id} className="flex items-center p-2 border rounded-md">
                <div>
                  <p className="font-medium">{permission.name}</p>
                  <p className="text-sm text-muted-foreground">{permission.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

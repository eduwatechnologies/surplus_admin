"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { StaffForm } from "@/components/staff/staff-form"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { updateStaffMember, logActivity, selectStaff } from "@/lib/redux/slices/staffSlice"
import { PermissionGuard } from "@/components/rbac/permission-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert } from "lucide-react"
import { useAuth } from "@/components/providers/auth-provider"

export default function EditStaffPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { id } = useParams()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { staff, selectedStaff } = useAppSelector((state) => state.staff)

  useEffect(() => {
    if (id && typeof id === "string") {
      dispatch(selectStaff(id))
    }
  }, [dispatch, id])

  const handleSubmit = async (formData: any) => {
    if (!selectedStaff) return

    setIsSubmitting(true)

    try {
      // Update the staff member
      await dispatch(
        updateStaffMember({
          id: selectedStaff._id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
        }),
      )

      // Log the activity
      if (user) {
        await dispatch(
          logActivity({
            staffId: user.id,
            staffName: user.name,
            action: "UPDATE",
            description: `Updated staff member: ${formData.name}`,
            module: "staff",
            metadata: { staffId: selectedStaff._id },
          }),
        )
      }

      // Redirect to staff list
      router.push("/staff")
    } catch (error) {
      console.error("Error updating staff member:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Staff Member</h1>
            <p className="text-muted-foreground">Update staff information</p>
          </div>

          <PermissionGuard
            requiredPermission="perm_staff_manage"
            fallback={
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5 text-red-500" />
                    Access Denied
                  </CardTitle>
                  <CardDescription>You don't have permission to edit staff members.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Please contact an administrator if you need access to this feature.</p>
                </CardContent>
              </Card>
            }
          >
            {selectedStaff ? (
              <StaffForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                initialData={selectedStaff}
                isEditing={true}
              />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p>Loading staff information...</p>
                </CardContent>
              </Card>
            )}
          </PermissionGuard>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

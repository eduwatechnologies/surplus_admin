"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StaffForm } from "@/components/staff/staff-form";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addStaffMember, logActivity } from "@/lib/redux/slices/staffSlice";
import { PermissionGuard } from "@/components/rbac/permission-guard";
import { useAuth } from "@/components/providers/auth-provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

export default function AddStaffPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);

    try {
      // Add the staff member
      const resultAction = await dispatch(
        addStaffMember({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
          password: formData.password,
        })
      );

      // Log the activity
      const createdStaffId =
        (resultAction.payload as any)?._id ?? (resultAction.payload as any)?.id;

      if (user && createdStaffId) {
        await dispatch(
          logActivity({
            staffId: user.id,
            staffName: user.name,
            action: "CREATE",
            description: `Created new staff member: ${formData.name}`,
            module: "staff",
            metadata: { staffId: createdStaffId },
          })
        );
      }

      // Redirect to staff list
      router.push("/staff");
    } catch (error) {
      console.error("Error adding staff member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Staff Member</h1>
        <p className="text-muted-foreground">Create a new staff account</p>
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
              <CardDescription>
                You don't have permission to add staff members.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Please contact an administrator if you need access to this
                feature.
              </p>
            </CardContent>
          </Card>
        }
      >
        <StaffForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </PermissionGuard>
    </>
  );
}

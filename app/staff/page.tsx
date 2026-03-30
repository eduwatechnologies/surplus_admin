"use client";

import type React from "react";

import { useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { StaffTable } from "@/components/staff/staff-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  fetchStaff,
  fetchRoles,
  fetchPermissions,
  setStaffSearchQuery,
} from "@/lib/redux/slices/staffSlice";
import { PermissionGuard } from "@/components/rbac/permission-guard";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector((state) => state.staff);
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchStaff());
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setStaffSearchQuery(e.target.value));
  };

  const handleAddStaff = () => {
    router.push("/staff/add");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Staff Management
              </h1>
              <p className="text-muted-foreground">
                Manage staff members and their roles
              </p>
            </div>
            <PermissionGuard
              requiredPermission="perm_staff_manage"
              fallback={null}
            >
              <Button
                onClick={handleAddStaff}
                className="text-white bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Add Staff Member
              </Button>
            </PermissionGuard>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search staff..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <StaffTable />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

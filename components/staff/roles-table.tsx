"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Users, Shield } from "lucide-react";
import { useAppSelector } from "@/lib/redux/hooks";
import { usePermissions } from "@/lib/rbac/permissions";
import { format } from "date-fns";

export function RolesTable() {
  const router = useRouter();
  const { roles, staff, permissions } = useAppSelector((state) => state.staff);
  const { hasPermission } = usePermissions();

  const canManageRoles = hasPermission("perm_roles_manage");

  const handleViewRole = (roleId: string) => {
    router.push(`/roles/${roleId}`);
  };

  const handleEditRole = (roleId: string) => {
    router.push(`/roles/${roleId}/edit`);
  };

  const countStaffWithRole = (roleId: string) => {
    const roleName = roles.find((r) => r._id === roleId)?.name;
    if (!roleName) return 0;
    return staff.filter((s) => s.role === roleName).length;
  };

  const countPermissions = (rolePermissions: string[]) => {
    return rolePermissions.length;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles</CardTitle>
        <CardDescription>
          Manage system roles and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Permissions</TableHead>
              <TableHead>Staff Count</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role._id}>
                <TableCell className="font-medium">{role.name}</TableCell>
                <TableCell>{role.description}</TableCell>
                <TableCell>
                  {countPermissions(role.permissions)} permissions
                </TableCell>
                <TableCell>
                  {countStaffWithRole(role._id)} staff members
                </TableCell>
                <TableCell>
                  {format(new Date(role.updatedAt), "MMM d, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleViewRole(role._id)}
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        <span>View Permissions</span>
                      </DropdownMenuItem>

                      {canManageRoles && (
                        <DropdownMenuItem
                          onClick={() => handleEditRole(role._id)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span>Edit Role</span>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem
                        onClick={() => router.push(`/staff?role=${role._id}`)}
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span>View Staff</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

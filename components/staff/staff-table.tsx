"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Edit, UserX, UserCheck, Eye } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateStaffMember, logActivity } from "@/lib/redux/slices/staffSlice";
import { usePermissions } from "@/lib/rbac/permissions";
import { useAuth } from "@/components/providers/auth-provider";
import { format, formatDistanceToNow } from "date-fns";

export function StaffTable() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAuth();
  const { filteredStaff, roles } = useAppSelector((state) => state.staff);
  const { hasPermission } = usePermissions();

  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "activate" | "suspend" | null
  >(null);

  const canManageStaff = hasPermission("perm_staff_manage");

  const getRoleName = (roleId: string) => {
    return roles.find((role) => role.name === roleId)?.name || "Unknown Role";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
            Active
          </Badge>
        );
      case "suspended":
        return (
          <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">
            Suspended
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleViewStaff = (staffId: string) => {
    router.push(`/staff/${staffId}`);
  };

  const handleEditStaff = (staffId: string) => {
    router.push(`/staff/${staffId}/edit`);
  };

  const handleStatusChange = (staffId: string, currentStatus: string) => {
    setSelectedStaffId(staffId);
    setActionType(currentStatus === "active" ? "suspend" : "activate");
    setConfirmDialogOpen(true);
  };

  const confirmStatusChange = () => {
    if (selectedStaffId) {
      const newStatus = actionType === "activate" ? "active" : "suspended";
      dispatch(
        updateStaffMember({
          id: selectedStaffId,
          status: newStatus,
        })
      );

      // Log the activity
      const staff = filteredStaff.find((s) => s._id === selectedStaffId);
      if (staff && user) {
        dispatch(
          logActivity({
            staffId: user.id,
            staffName: user.name,
            action: "UPDATE",
            description: `${
              actionType === "activate" ? "Activated" : "Suspended"
            } staff member: ${staff.name}`,
            module: "staff",
            metadata: {
              staffId: selectedStaffId,
              newStatus,
            },
          })
        );
      }

      setConfirmDialogOpen(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const formatLastLogin = (lastLogin: string | null) => {
    if (!lastLogin) return "Never";

    try {
      const date = new Date(lastLogin);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Members</CardTitle>
        <CardDescription>
          Showing {filteredStaff.length} staff members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Staff</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaff.map((staff) => (
              <TableRow key={staff._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={staff.avatar || "/placeholder.svg"}
                        alt={staff.name}
                      />
                      <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{staff.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {staff.phone}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.email}</TableCell>
                <TableCell>{getRoleName(staff.role)}</TableCell>
                <TableCell>{getStatusBadge(staff.status)}</TableCell>
                <TableCell>{formatLastLogin(staff.lastLogin)}</TableCell>
                <TableCell>
                  {format(new Date(staff.createdAt), "MMM d, yyyy")}
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
                        onClick={() => handleViewStaff(staff._id)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>

                      {canManageStaff && (
                        <>
                          <DropdownMenuItem
                            onClick={() => handleEditStaff(staff._id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Edit Staff</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(staff._id, staff.status)
                            }
                          >
                            {staff.status === "active" ? (
                              <>
                                <UserX className="mr-2 h-4 w-4" />
                                <span>Deactivate</span>
                              </>
                            ) : (
                              <>
                                <UserCheck className="mr-2 h-4 w-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === "activate"
                  ? "Activate Staff Member"
                  : "Suspend Staff Member"}
              </DialogTitle>
              <DialogDescription>
                {actionType === "activate"
                  ? "This will allow the staff member to log in and access the system."
                  : "This will prevent the staff member from logging in and accessing the system."}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setConfirmDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStatusChange}
                className={
                  actionType === "activate"
                    ? "text-white bg-blue-600 hover:bg-blue-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }
              >
                {actionType === "activate" ? "Activate" : "Suspend"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

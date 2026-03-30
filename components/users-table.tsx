"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  CreditCard,
  Wallet,
  Ban,
  CheckCircle,
  Key,
  Lock,
  User,
  DollarSign,
  Trash,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  DefundUser,
  RefundUser,
  toggleUserStatus,
  updatePassword,
  updatePin,
  updateStatus,
  updateOwning,
  deleteUser,
} from "@/lib/redux/slices/userSlice";
import { toast } from "@/hooks/use-toast";
import { RootState } from "@/lib/redux/store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export function UsersTable() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { filteredUsers, isLoading } = useAppSelector((state) => state.users);

  const [dialogType, setDialogType] = useState<
    "wallet" | "reset" | "owing" | "delete" | null
  >(null);
  const [transactionType, setTransactionType] = useState<"credit" | "debit">(
    "credit"
  );
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [resetType, setResetType] = useState<"pin" | "password">("pin");

  const selectedUser = filteredUsers.find((u) => u._id === selectedUserId);
  const [walletDialogOpen, setWalletDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const handleWalletAction = (userId: string, type: "credit" | "debit") => {
    setSelectedUserId(userId);
    setTransactionType(type);
    setDialogType("wallet");
  };

  const handleOwningAction = (userId: string) => {
    setSelectedUserId(userId);
    setDialogType("owing");
  };

  const handleDeleteAction = (userId: string) => {
    setSelectedUserId(userId);
    setDialogType("delete");
  };

  const handleResetAction = (userId: string, type: "pin" | "password") => {
    setSelectedUserId(userId);
    setResetType(type);
    setDialogType("reset");
  };

  // const handleWalletSubmit = async () => {
  //   if (!selectedUserId || !amount) return;

  //   try {
  //     if (transactionType === "credit") {
  //       await dispatch(RefundUser({ userId: selectedUserId, amount })).unwrap();
  //     } else {
  //       await dispatch(DefundUser({ userId: selectedUserId, amount })).unwrap();
  //     }

  //     toast({
  //       title: "Wallet Updated",
  //       description: `₦${amount} ${
  //         transactionType === "credit" ? "added to" : "removed from"
  //       } wallet.`,
  //     });
  //     setDialogType(null);
  //     setAmount("");
  //   } catch {
  //     toast({ title: "Error", description: "Wallet update failed." });
  //   }
  // };

  const handleOwningSubmit = async () => {
    if (!selectedUserId || !amount) return;

    try {
      await dispatch(
        updateOwning({ userId: selectedUserId, amount: amount })
      ).unwrap();

      toast({
        title: "Owning Updated",
        description: `₦${amount} added as user's owing amount.`,
      });

      setDialogType(null);
      setAmount("");
    } catch {
      toast({
        title: "Error",
        description: "Could not update owing amount.",
      });
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedUserId) return;

    try {
      await dispatch(deleteUser(selectedUserId)).unwrap();
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
      });
      setDialogType(null);
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  // const handleResetSubmit = async () => {
  //   if (!selectedUserId) return;

  //   try {
  //     if (resetType === "password") {
  //       await dispatch(
  //         updatePassword({ userId: selectedUserId, newPassword: "2323232" })
  //       ).unwrap();
  //       toast({
  //         title: "Password Reset Successful",
  //         description: "User password reset to default.",
  //       });
  //     } else {
  //       await dispatch(
  //         updatePin({ userId: selectedUserId, newpin: "2323" })
  //       ).unwrap();
  //       toast({
  //         title: "PIN Reset Successful",
  //         description: "User PIN reset to default.",
  //       });
  //     }

  //     setDialogType(null);
  //   } catch {
  //     toast({
  //       title: "Reset Failed",
  //       description: "Could not reset credentials.",
  //     });
  //   }
  // };

  const handleStatusToggle = (userId: string) => {
    dispatch(updateStatus(userId));
  };

  // Pagination
  const handleWalletSubmit = async () => {
    if (selectedUserId && amount) {
      try {
        if (transactionType === "credit") {
          await dispatch(
            RefundUser({ userId: selectedUserId, amount })
          ).unwrap();
        } else {
          await dispatch(
            DefundUser({ userId: selectedUserId, amount })
          ).unwrap();
        }

        toast({
          title: "Wallet Updated",
          description: `₦${amount} ${
            transactionType === "credit" ? "added to" : "removed from"
          } wallet.`,
        });

        setWalletDialogOpen(false);
        setAmount("");
      } catch (error) {
        toast({
          title: "Update failed",
          description: "Could not update wallet balance.",
        });
        console.error(error);
      }
    }
  };

  const handleResetSubmit = async () => {
    try {
      if (!selectedUser?._id) {
        toast({
          title: "User not selected",
          description: "Please select a user before resetting credentials.",
        });
        return;
      }

      if (resetType === "password") {
        await dispatch(
          updatePassword({
            userId: selectedUser._id,
            newPassword: "232323",
          })
        ).unwrap();

        toast({
          title: "Password Reset Successful",
          description: `Password for ${
            selectedUser?.firstName || "this user"
          } has been reset to default.`,
        });
      } else {
        await dispatch(
          updatePin({
            userId: selectedUser._id,
            newpin: "2323",
          })
        ).unwrap();

        toast({
          title: "PIN Reset Successful",
          description: `Transaction PIN for ${
            selectedUser?.firstName || "this user"
          } has been reset to default.`,
        });
      }

      setResetDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Reset Failed",
        description:
          "An error occurred while resetting the user’s credentials.",
      });
    }
  };

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 100;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Total Users: {filteredUsers.length}</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Owing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>USR{user._id.slice(-3)}</TableCell>
                <TableCell>
                  {user.firstName} {user.lastName}
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>₦{user.balance}</TableCell>
                <TableCell>₦{user.owning || 0}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  >
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
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
                        onClick={() => router.push(`/users/${user._id}`)}
                      >
                        <User className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleWalletAction(user._id, "credit")}
                      >
                        <CreditCard className="mr-2 h-4 w-4" /> Credit Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleWalletAction(user._id, "debit")}
                      >
                        <Wallet className="mr-2 h-4 w-4" /> Debit Wallet
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleOwningAction(user._id)}
                      >
                        <DollarSign className="mr-2 h-4 w-4" /> Add Owing
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleResetAction(user._id, "pin")}
                      >
                        <Key className="mr-2 h-4 w-4" /> Reset PIN
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleResetAction(user._id, "password")}
                      >
                        <Lock className="mr-2 h-4 w-4" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleStatusToggle(user._id)}
                      >
                        {user.status === "active" ? (
                          <>
                            <Ban className="mr-2 h-4 w-4" /> Suspend Account
                          </>
                        ) : (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" /> Activate
                            Account
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDeleteAction(user._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Next
          </Button>
        </div>

        {/* Dialogs */}
        <Dialog
          open={dialogType === "delete"}
          onOpenChange={() => setDialogType(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={dialogType === "wallet"}
          onOpenChange={() => setDialogType(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {transactionType === "credit" ? "Credit" : "Debit"} Wallet
              </DialogTitle>
              <DialogDescription>
                Manage user’s wallet balance.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button onClick={handleWalletSubmit}>
                {transactionType === "credit" ? "Credit" : "Debit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={dialogType === "owing"}
          onOpenChange={() => setDialogType(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Owing Amount</DialogTitle>
              <DialogDescription>
                Add or update a user’s owing balance.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label>Amount (₦)</Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button onClick={handleOwningSubmit}>Add Owing</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={dialogType === "reset"}
          onOpenChange={() => setDialogType(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Reset {resetType === "pin" ? "PIN" : "Password"}
              </DialogTitle>
              <DialogDescription>
                This will reset the user’s {resetType} to default.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogType(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleResetSubmit}>
                Reset {resetType === "pin" ? "PIN" : "Password"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

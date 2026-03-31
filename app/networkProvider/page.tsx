"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  deleteProvider,
  fetchProviders,
} from "@/lib/redux/slices/networkProviderSlice";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import NetworkProviderForm from "./components/networkProviderForm";
import { RootState } from "@/lib/redux/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

export default function NetworkProvidersPage() {
  const dispatch = useAppDispatch();
  const { providers, loading, error } = useSelector(
    (state: RootState) => state.networkProviders
  );

  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchProviders());
  }, [dispatch]);

  const handleAdd = () => {
    setEditingProvider(null);
    setShowModal(true);
  };

  const handleEdit = (provider: any) => {
    setEditingProvider(provider);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this provider?")) {
      try {
        await dispatch(deleteProvider(id)).unwrap();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Network Provider Management
              </h2>
              <p className="text-muted-foreground">
                Manage your network providers and their configurations here.
              </p>
            </div>
            <Button
              className="text-white bg-blue-600 hover:bg-blue-700"
              onClick={handleAdd}
            >
              Add New Provider
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Network Provider</CardTitle>
              <CardDescription>
                Manage your Network Provider and their configurations here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading providers...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : providers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <span className="text-sm text-muted-foreground">
                      No providers found.
                    </span>
                  </TableCell>
                </TableRow>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Mode</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Auto Wallet Funding</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.map((provider: any) => (
                      <TableRow key={provider._id}>
                        <TableCell>{provider.provider}</TableCell>
                        <TableCell>
                          {provider.testMode ? "test" : "live"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={provider.enabled ? "default" : "outline"}
                          >
                            {provider.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {provider.autoWalletFunding ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(provider)}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600 focus:text-red-700"
                                  onClick={() => handleDelete(provider._id)}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Modal */}
          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProvider ? "Edit Provider" : "Add New Provider"}
                </DialogTitle>
              </DialogHeader>

              <NetworkProviderForm
                initialData={editingProvider as any}
                onClose={() => setShowModal(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

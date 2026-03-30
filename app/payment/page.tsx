"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  deletePaymentProvider,
  fetchPaymentProviders,
} from "@/lib/redux/slices/paymentProviderSlice";

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
import PaymentProviderForm from "./components/paymentForm";
import { ApActionDropdown } from "@/components/commons/dropdown/dropdown";
import { Pencil, Trash } from "lucide-react";

export default function NetworkProvidersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { providers, loading } = useSelector(
    (state: RootState) => state.paymentProviders
  );
  const [showModal, setShowModal] = useState(false);
  const [editingProvider, setEditingProvider] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchPaymentProviders());
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
        await dispatch(deletePaymentProvider(id)).unwrap();
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
                Payment Gateway Management
              </h2>
              <p className="text-muted-foreground">
                Manage your payment providers and settings
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
              <CardTitle>Payment Gateways</CardTitle>
              <CardDescription>
                Configure and manage your payment gateways and providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-10">Loading providers...</p>
              ) : providers.length === 0 ? (
                <p className="text-center py-10 text-muted-foreground">
                  No providers available.
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Base URL</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Webhook Enabled</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider._id}>
                        <TableCell>{provider.provider}</TableCell>
                        <TableCell>{provider.baseUrl}</TableCell>
                        <TableCell>
                          <Badge
                            variant={provider.enabled ? "default" : "outline"}
                          >
                            {provider.enabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {provider.webhook?.enabled ? "Yes" : "No"}
                        </TableCell>
                        <TableCell>
                          <ApActionDropdown
                            actions={[
                              {
                                label: "Edit",
                                icon: <Pencil className="w-4 h-4" />,
                                onClick: () => handleEdit(provider),
                              },
                              {
                                label: "Delete",
                                icon: <Trash className="w-4 h-4" />,
                                onClick: () =>
                                  handleDelete(provider._id as any),
                                className: "text-red-500",
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Dialog open={showModal} onOpenChange={setShowModal}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProvider ? "Edit Provider" : "Add New Provider"}
                </DialogTitle>
              </DialogHeader>

              <PaymentProviderForm
                initialData={editingProvider}
                onClose={() => setShowModal(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

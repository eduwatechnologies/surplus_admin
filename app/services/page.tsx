"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ExpandToggleButton } from "./components/ExpandableRow";
import { FormDialog } from "./components/formDailog";
import { SubServicesTable } from "./tables/subServiceTable";
import {
  addService,
  addSubService,
  deleteService,
  deleteServicePlan,
  deleteSubService,
  fetchServices,
  toggleSubServiceStatus,
  updateService,
  updateSubService,
} from "@/lib/redux/slices/service/serviceThunk";
import { setServiceSearchQuery } from "@/lib/redux/slices/service/serviceSlice";
import { SubServiceForm } from "./forms/subService";
import { useToast } from "@/hooks/use-toast";
import { ServicePlanForm } from "./forms/servicePlan";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/store";
import { CategoryProviderForm } from "./forms/categoryProvider";

export default function ServicesPage() {
  const toast = useToast();
  const dispatch = useAppDispatch();

  const { filteredServices, isLoading, error } = useAppSelector(
    (state) => state.services
  );
  const subServiceId = useSelector(
    (state: RootState) => state.services.selectedSubService?._id
  );

  useEffect(() => {
    if (error) {
      toast.toast({
        title: "Failed",
        description: decodeURIComponent(error),
        variant: "destructive",
      });
    }
  }, [error]);

  const [expandedServiceId, setExpandedServiceId] = useState<string | null>(
    null
  );
  const [expandedSubServiceId, setExpandedSubServiceId] = useState<
    string | null
  >(null);

  const [openDialogForService, setOpenDialogForService] = useState<
    string | null
  >(null);
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [openDialogForPlan, setOpenDialogForPlan] = useState<string | null>(
    null
  );

  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceType, setNewServiceType] = useState("airtime");
  const [newServiceDescription, setNewServiceDescription] = useState("");
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [editingSubservice, setEditingSubservice] = useState<any | null>(null);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchServices());
  }, [dispatch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setServiceSearchQuery(e.target.value));
  };

  const toggleExpandService = (id: string) => {
    setExpandedServiceId((prev) => (prev === id ? null : id));
    setExpandedSubServiceId(null); // reset subservice expansion
  };

  const toggleExpandSubService = (id: string) => {
    setExpandedSubServiceId((prev) => (prev === id ? null : id));
  };

  const handleToggleStatus = (subId: string) => {
    dispatch(toggleSubServiceStatus(subId));
  };

  const handleEditSubService = (sub: any) => {
    setEditingSubservice(sub);
    setOpenDialogForService(sub.serviceId);
  };

  const handleDeleteSubService = (subserviceId: string) => {
    dispatch(deleteSubService(subserviceId));
  };

  const handleAddPlan = (subServiceId: string) => {
    console.log("Service ID:", subServiceId);
    setEditingPlan(null);
    setOpenDialogForPlan(subServiceId);
  };

  const handleEditPlan = (plan: any) => {
    setEditingPlan(plan);
    setOpenDialogForPlan(plan.subServiceId); // make sure this exists
  };

  const handleDeleteServicePlan = (id: string) => {
    dispatch(deleteServicePlan(id));
  };

  const handleCategoryAdding = () => {
    setOpenCategoryDialog(true);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex-1 space-y-6 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Services Monitoring
            </h1>
            <p className="text-muted-foreground">
              Track usage and performance of VTU services
            </p>
          </div>

          {/* Search bar */}
          <div className="flex justify-between items-center">
            <Input
              placeholder="Search services..."
              className="max-w-sm"
              onChange={handleSearch}
            />
            <div className=" gap-x-4">
              <Button
                onClick={() => setOpenServiceDialog(true)}
                className="mr-8"
              >
                Add Service
              </Button>

              {/* <Button onClick={() => handleCategoryAdding()}>
                Data Catgories
              </Button> */}
            </div>
          </div>

          {/* Table Section */}
          {isLoading ? (
            <p>Loading services...</p>
          ) : (
            <div className="border rounded-lg overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    {/* <TableHead>Status</TableHead> */}
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Subservices</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => {
                    const expanded = expandedServiceId === service._id;
                    return (
                      <>
                        <TableRow
                          key={service._id}
                          className="hover:bg-muted/20"
                        >
                          <TableCell>
                            <ExpandToggleButton
                              expanded={expanded}
                              onToggle={() => toggleExpandService(service._id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {service.name}
                          </TableCell>
                          <TableCell>{service.type}</TableCell>
                          {/* <TableCell>
                            <Switch checked={service.status} disabled />
                          </TableCell> */}
                          <TableCell>{service.description || "-"}</TableCell>
                          <TableCell className="text-center">
                            {service?.subServices?.length}
                          </TableCell>
                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedService(service);
                                    setNewServiceName(service.name);
                                    setNewServiceType(service.type);
                                    setNewServiceDescription(
                                      service.description || ""
                                    );
                                    setOpenServiceDialog(true);
                                  }}
                                >
                                  Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() => {
                                    dispatch(deleteService(service._id));
                                  }}
                                >
                                  Delete
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                  onClick={() =>
                                    setOpenDialogForService(service._id)
                                  }
                                >
                                  Add Subservice
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>

                        {/* Expandable sub-services table */}
                        {expanded && service.subServices?.length > 0 && (
                          <TableRow className="bg-muted/10">
                            <TableCell colSpan={7}>
                              <div className="p-4 space-y-6">
                                <h3 className="font-semibold">Subservices</h3>
                                <div className="border rounded-lg overflow-hidden">
                                  <SubServicesTable
                                    service={service}
                                    subServices={service.subServices}
                                    expandedSubServiceId={expandedSubServiceId}
                                    onToggleSubService={setExpandedSubServiceId}
                                    onToggleStatus={handleToggleStatus}
                                    onDelete={handleDeleteSubService}
                                    onEdit={handleEditSubService}
                                    onAddPlan={handleAddPlan}
                                    onEditPlan={handleEditPlan}
                                    onDeletePlan={handleDeleteServicePlan}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <FormDialog
            open={openServiceDialog}
            onOpenChange={() => {
              setOpenServiceDialog(false);
              setSelectedService(null); // reset when closing
            }}
            title={selectedService ? "Edit Service" : "Add Service"}
          >
            <div className="space-y-4">
              <Input
                placeholder="Service name"
                value={newServiceName}
                onChange={(e) => setNewServiceName(e.target.value)}
              />
              <Input
                placeholder="Type (airtime, data, electricity, etc.)"
                value={newServiceType}
                onChange={(e) => setNewServiceType(e.target.value)}
              />
              <Input
                placeholder="Description"
                value={newServiceDescription}
                onChange={(e) => setNewServiceDescription(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  if (selectedService) {
                    dispatch(
                      updateService({
                        id: selectedService._id,
                        data: {
                          name: newServiceName,
                          type: newServiceType as any,
                          description: newServiceDescription,
                          status: selectedService.status,
                        },
                      })
                    );
                  } else {
                    dispatch(
                      addService({
                        name: newServiceName,
                        type: newServiceType as any,
                        description: newServiceDescription,
                        status: true,
                      })
                    );
                  }

                  setOpenServiceDialog(false);
                  setSelectedService(null);
                  setNewServiceName("");
                  setNewServiceType("airtime");
                  setNewServiceDescription("");
                }}
              >
                {selectedService ? "Update" : "Add"}
              </Button>
            </div>
          </FormDialog>

          <FormDialog
            open={!!openDialogForService}
            onOpenChange={() => {
              setOpenDialogForService(null);
              setEditingSubservice(null);
            }}
            title={editingSubservice ? "Edit Subservice" : "Add Subservice"}
          >
            {openDialogForService && (
              <SubServiceForm
                serviceId={openDialogForService}
                initialValues={editingSubservice ?? undefined} // ✅ fix here
                onSubmitSuccess={() => {
                  setOpenDialogForService(null);
                  setEditingSubservice(null);
                }}
              />
            )}
          </FormDialog>

          <FormDialog
            open={!!openDialogForPlan}
            onOpenChange={() => {
              setOpenDialogForPlan(null);
              setEditingPlan(null);
            }}
            title={editingPlan ? "Edit Service Plan" : "Add Service Plan"}
          >
            {openDialogForPlan && (
              <ServicePlanForm
                subServiceId={openDialogForPlan}
                initialValues={editingPlan ?? undefined}
                onSubmitSuccess={() => {
                  setOpenDialogForPlan(null);
                  setEditingPlan(null);
                }}
                // onDelete={() => handleDeleteServicePlan(editingPlan?._id)}
              />
            )}
          </FormDialog>

          <FormDialog
            open={!!openCategoryDialog}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpenCategoryDialog(false); // Close dialog when user clicks outside or presses ESC
              }
            }}
            title="Add Category"
          >
            <CategoryProviderForm
              onSubmitSuccess={() => {
                setOpenCategoryDialog(false); // Close after successful submit
              }}
            />
          </FormDialog>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

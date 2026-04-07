"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServicePlan } from "@/lib/redux/slices/service/type";
import { ConfirmDeleteDialog } from "@/components/commons/alert/confirm";
import {
  fetchCategoryProviders,
  updateCategoryProvider,
  deleteCategoryProvider,
} from "@/lib/redux/slices/categoryProviderSlice";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export function PlansTable({
  plans,
  subName,
  onEdit,
  onDelete,
  subId,
  subCode,
  serviceType,
  subProvider,
  onAddCategory,
}: {
  subName: string;
  plans: ServicePlan[];
  onEdit: (plan: ServicePlan) => void;
  onDelete: (planId: string) => void;
  subId: string;
  subCode: string;
  serviceType: string;
  subProvider?: string;
  onAddCategory: (args: { subServiceId: string; network: string }) => void;
}) {
  const dispatch = useDispatch();
  const categoryProviders = useSelector(
    (state: any) => state.categoryProviders.items
  );

  useEffect(() => {
    dispatch(fetchCategoryProviders(subId) as any);
  }, [dispatch, subId]);

  return (
    <div className="space-y-8">
      {/* Category Providers Table */}
      {serviceType === "data" && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3">
            <h4 className="font-semibold">Category Providers</h4>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const network = String(subCode || "").split("-")[0];
                onAddCategory({ subServiceId: subId, network });
              }}
            >
              Add Category
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryProviders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500">
                    No category providers found
                  </TableCell>
                </TableRow>
              ) : (
                categoryProviders.map((c: any) => (
                  <TableRow key={c._id}>
                    <TableCell>{c.category}</TableCell>

                    {/* Provider Dropdown */}
                    <TableCell>
                      <Select
                        defaultValue={c.provider}
                        onValueChange={(val) => {
                          dispatch(
                            updateCategoryProvider({
                              id: c._id,
                              provider: val,
                            }) as any
                          );

                          toast({
                            title: "Provider Updated",
                            description: `Provider for ${c?._id} changed to ${val}.`,
                            duration: 3000,
                          });
                        }}
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select Provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easyaccess">EasyAccess</SelectItem>
                          <SelectItem value="autopilot">Autopilot</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    {/* Status Switch */}
                    <TableCell>
                      <Switch
                        checked={c.status}
                        onCheckedChange={(val) => {
                          dispatch(
                            updateCategoryProvider({
                              ...c,
                              id: c._id,
                              status: val,
                              provider: c.provider,
                            }) as any
                          );

                          toast({
                            title: "Provider Status Updated",
                            description: `Provider for ${val} has been ${
                              val ? "enabled" : "disabled"
                            }.`,
                            duration: 3000,
                          });
                        }}
                      />
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          dispatch(deleteCategoryProvider(c._id) as any)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Plans Table */}
      <div>
        <h4 className="font-semibold mb-2">{subName} Plans</h4>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead>Plan Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan._id}>
                  <TableCell>{plan.name}</TableCell>
                  <TableCell>{plan.category}</TableCell>
                  <TableCell>{plan.ourPrice}</TableCell>
                  <TableCell>{plan.validity}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() =>
                            onEdit({
                              ...plan,
                              subServiceId: (plan as any).subServiceId || subId,
                              subCode,
                              provider: subProvider,
                              serviceType,
                            } as any)
                          }
                        >
                          Edit
                        </DropdownMenuItem>

                        <ConfirmDeleteDialog
                          itemName={plan.name}
                          onConfirm={() => onDelete(plan._id!)}
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

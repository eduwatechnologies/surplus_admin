import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ExpandToggleButton } from "../components/ExpandableRow";
import { PlansTable } from "./servicePlanTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { switchProvider } from "@/lib/redux/slices/service/serviceThunk";
import { useAppDispatch } from "@/lib/redux/hooks";
import { ConfirmDeleteDialog } from "@/components/commons/alert/confirm";

export function SubServicesTable({
  service,
  subServices,
  expandedSubServiceId,
  onToggleSubService,
  onToggleStatus,
  onAddPlan,
  onDelete,
  onEdit,
  onEditPlan,
  onDeletePlan,
}: any) {
  const dispatch = useAppDispatch();

  const handleProviderChange = (value: string, subId: string) => {
    dispatch(switchProvider({ id: subId, provider: value }));
  };

  return (
    <div className="space-y-8">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/20">
            <TableHead></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Code</TableHead>
            {service?.type !== "data" && <TableHead>Provider</TableHead>}
            <TableHead>Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subServices.map((sub: any) => {
            const subExpanded = expandedSubServiceId === sub._id;
            return (
              <>
                <TableRow key={sub._id}>
                  <TableCell>
                    <ExpandToggleButton
                      expanded={subExpanded}
                      onToggle={() => onToggleSubService(sub._id)}
                    />
                  </TableCell>
                  <TableCell>{sub.name}</TableCell>
                  <TableCell>{sub.code}</TableCell>

                  {service?.type !== "data" && (
                    <TableCell>
                      <Select
                        defaultValue={sub.provider}
                        onValueChange={(value) =>
                          handleProviderChange(value, sub._id)
                        }
                      >
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="autopilot">Autopilot</SelectItem>
                          <SelectItem value="easyaccess">EasyAccess</SelectItem>
                <SelectItem value="remita">remita</SelectItem>

                        </SelectContent>
                      </Select>
                    </TableCell>
                  )}
                  <TableCell>
                    <Switch
                      checked={sub.status}
                      onCheckedChange={() => onToggleStatus(sub._id)}
                    />
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
                        <DropdownMenuItem onClick={() => onEdit(sub)}>
                          Edit
                        </DropdownMenuItem>
                        <ConfirmDeleteDialog
                          itemName={sub.name}
                          onConfirm={() => onDelete(sub._id)}
                        />
                        <DropdownMenuItem onClick={() => onAddPlan(sub?._id)}>
                          Add Plan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>

                {subExpanded && sub.servicePlans?.length > 0 && (
                  <TableRow key={`${sub._id}-plans`} className="bg-muted/5">
                    <TableCell colSpan={6}>
                      <PlansTable
                        plans={sub.servicePlans}
                        subName={sub.name}
                        onEdit={onEditPlan}
                        onDelete={onDeletePlan}
                        subId={sub._id}
                      />
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

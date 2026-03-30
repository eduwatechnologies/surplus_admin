"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { filterActivityLogs } from "@/lib/redux/slices/staffSlice"
import { format } from "date-fns"

interface StaffActivityLogsProps {
  staffId?: string
}

export function StaffActivityLogs({ staffId }: StaffActivityLogsProps) {
  const dispatch = useAppDispatch()
  const { filteredLogs, activityLogs } = useAppSelector((state) => state.staff)

  useEffect(() => {
    if (staffId) {
      dispatch(filterActivityLogs({ staffId }))
    }
  }, [dispatch, staffId, activityLogs])

  const handleFilterChange = (field: string, value: string) => {
    dispatch(
      filterActivityLogs({
        ...(staffId ? { staffId } : {}),
        [field]: value === "all" ? undefined : value,
      }),
    )
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Create</Badge>
      case "UPDATE":
        return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200">Update</Badge>
      case "DELETE":
        return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Delete</Badge>
      case "LOGIN":
        return (
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            Login
          </Badge>
        )
      case "LOGOUT":
        return <Badge variant="outline">Logout</Badge>
      case "VIEW":
        return <Badge variant="secondary">View</Badge>
      default:
        return <Badge variant="secondary">{action}</Badge>
    }
  }

  // Get unique modules for filtering
  const modules = Array.from(new Set(activityLogs.map((log) => log.module)))

  // Get unique actions for filtering
  const actions = Array.from(new Set(activityLogs.map((log) => log.action)))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Logs</CardTitle>
        <CardDescription>Recent actions performed by {staffId ? "this staff member" : "all staff"}</CardDescription>

        <div className="flex flex-wrap gap-2 mt-4">
          <div className="w-40">
            <Select defaultValue="all" onValueChange={(value) => handleFilterChange("module", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by module" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {modules.map((module) => (
                  <SelectItem key={module} value={module} className="capitalize">
                    {module}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select defaultValue="all" onValueChange={(value) => handleFilterChange("actionType", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                {actions.map((action) => (
                  <SelectItem key={action} value={action} className="capitalize">
                    {action.toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              {!staffId && <TableHead>Staff</TableHead>}
              <TableHead>Action</TableHead>
              <TableHead>Module</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(log.timestamp), "MMM d, yyyy HH:mm:ss")}
                  </TableCell>
                  {!staffId && <TableCell>{log.staffName}</TableCell>}
                  <TableCell>{getActionBadge(log.action)}</TableCell>
                  <TableCell className="capitalize">{log.module}</TableCell>
                  <TableCell>{log.description}</TableCell>
                  <TableCell>{log.ipAddress || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={staffId ? 5 : 6} className="text-center py-4">
                  No activity logs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

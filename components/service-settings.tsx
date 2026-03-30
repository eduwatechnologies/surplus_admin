"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

const services = [
  {
    id: "SRV001",
    name: "MTN Airtime",
    category: "Airtime",
    provider: "VTpass",
    status: "enabled",
    lastUpdated: "2024-01-15 10:30 AM",
  },
  {
    id: "SRV002",
    name: "Airtel Data Bundles",
    category: "Data",
    provider: "VTpass",
    status: "enabled",
    lastUpdated: "2024-01-15 09:45 AM",
  },
  {
    id: "SRV003",
    name: "Glo Airtime",
    category: "Airtime",
    provider: "VTpass",
    status: "disabled",
    lastUpdated: "2024-01-14 15:20 PM",
  },
  {
    id: "SRV004",
    name: "DSTV Subscription",
    category: "Cable TV",
    provider: "VTpass",
    status: "enabled",
    lastUpdated: "2024-01-15 08:15 AM",
  },
  {
    id: "SRV005",
    name: "NEPA Electricity",
    category: "Electricity",
    provider: "VTpass",
    status: "enabled",
    lastUpdated: "2024-01-15 07:30 AM",
  },
  {
    id: "SRV006",
    name: "9mobile Data",
    category: "Data",
    provider: "VTpass",
    status: "disabled",
    lastUpdated: "2024-01-13 16:45 PM",
  },
  {
    id: "SRV007",
    name: "WAEC Result Checker",
    category: "Education",
    provider: "VTpass",
    status: "enabled",
    lastUpdated: "2024-01-15 11:20 AM",
  },
  {
    id: "SRV008",
    name: "Spectranet Data",
    category: "Internet",
    provider: "VTpass",
    status: "disabled",
    lastUpdated: "2024-01-12 14:10 PM",
  },
]

export function ServiceSettings() {
  const [serviceStates, setServiceStates] = useState(
    services.reduce(
      (acc, service) => ({
        ...acc,
        [service.id]: service.status === "enabled",
      }),
      {},
    ),
  )

  const handleServiceToggle = (serviceId: string, enabled: boolean) => {
    setServiceStates((prev) => ({
      ...prev,
      [serviceId]: enabled,
    }))
    // In a real app, this would call an API to update the service status
    console.log(`${enabled ? "Enabling" : "Disabling"} service ${serviceId}`)
  }

  const getStatusBadge = (serviceId: string) => {
    const isEnabled = serviceStates[serviceId]
    return isEnabled ? (
      <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Enabled</Badge>
    ) : (
      <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Disabled</Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Management</CardTitle>
        <CardDescription>Enable or disable VTU services for your platform</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Enable/Disable</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.category}</TableCell>
                <TableCell>{service.provider}</TableCell>
                <TableCell>{getStatusBadge(service.id)}</TableCell>
                <TableCell className="text-muted-foreground">{service.lastUpdated}</TableCell>
                <TableCell>
                  <Switch
                    checked={serviceStates[service.id]}
                    onCheckedChange={(checked) => handleServiceToggle(service.id, checked)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

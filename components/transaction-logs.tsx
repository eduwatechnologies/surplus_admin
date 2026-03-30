"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, Download } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

// Sample log data
const logs = [
  {
    id: "LOG001",
    timestamp: "2024-01-15 10:30:25",
    type: "api-call",
    service: "airtime",
    endpoint: "/api/v1/airtime/purchase",
    method: "POST",
    statusCode: 200,
    responseTime: "1.2s",
    requestId: "REQ123456789",
    userId: "USR001",
    amount: "₦1,000",
    network: "MTN",
    request: {
      phone: "08012345678",
      amount: 1000,
      network: "mtn",
    },
    response: {
      status: "success",
      transaction_id: "TXN001",
      balance: 14000,
    },
  },
  {
    id: "LOG002",
    timestamp: "2024-01-15 10:28:15",
    type: "error",
    service: "data",
    endpoint: "/api/v1/data/purchase",
    method: "POST",
    statusCode: 500,
    responseTime: "5.0s",
    requestId: "REQ234567890",
    userId: "USR002",
    amount: "₦2,500",
    network: "Airtel",
    error: "VTpass API timeout - no response after 30 seconds",
    request: {
      phone: "08023456789",
      amount: 2500,
      network: "airtel",
      plan: "1GB",
    },
    response: {
      error: "Gateway timeout",
      code: "TIMEOUT_ERROR",
    },
  },
  {
    id: "LOG003",
    timestamp: "2024-01-15 10:25:45",
    type: "api-call",
    service: "electricity",
    endpoint: "/api/v1/electricity/purchase",
    method: "POST",
    statusCode: 201,
    responseTime: "2.8s",
    requestId: "REQ345678901",
    userId: "USR003",
    amount: "₦5,000",
    network: "NEPA",
    request: {
      meter_number: "12345678901",
      amount: 5000,
      provider: "nepa",
    },
    response: {
      status: "success",
      transaction_id: "TXN003",
      token: "1234-5678-9012-3456",
    },
  },
  {
    id: "LOG004",
    timestamp: "2024-01-15 10:20:12",
    type: "webhook",
    service: "airtime",
    endpoint: "/webhook/vtpass",
    method: "POST",
    statusCode: 200,
    responseTime: "0.5s",
    requestId: "WH456789012",
    userId: null,
    amount: null,
    network: null,
    request: {
      event: "transaction.completed",
      transaction_id: "TXN001",
      status: "successful",
    },
    response: {
      acknowledged: true,
    },
  },
]

const getStatusBadge = (statusCode: number) => {
  if (statusCode >= 200 && statusCode < 300) {
    return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">{statusCode}</Badge>
  } else if (statusCode >= 400 && statusCode < 500) {
    return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200">{statusCode}</Badge>
  } else if (statusCode >= 500) {
    return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">{statusCode}</Badge>
  }
  return <Badge variant="secondary">{statusCode}</Badge>
}

const getTypeBadge = (type: string) => {
  switch (type) {
    case "api-call":
      return (
        <Badge variant="outline" className="text-blue-600 border-blue-600">
          API Call
        </Badge>
      )
    case "error":
      return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Error</Badge>
    case "webhook":
      return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Webhook</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

interface TransactionLogsProps {
  filters: {
    logType: string
    status: string
    service: string
    startDate?: Date
    endDate?: Date
  }
}

export function TransactionLogs({ filters }: TransactionLogsProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null)

  // Apply filters to logs
  const filteredLogs = logs.filter((log) => {
    if (filters.logType !== "all" && log.type !== filters.logType) {
      return false
    }

    if (filters.service !== "all" && log.service !== filters.service) {
      return false
    }

    if (filters.status !== "all") {
      if (filters.status === "success" && (log.statusCode < 200 || log.statusCode >= 300)) {
        return false
      }
      if (filters.status === "error" && log.statusCode >= 200 && log.statusCode < 400) {
        return false
      }
    }

    return true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
        <CardDescription>Showing {filteredLogs.length} log entries</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Endpoint</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Response Time</TableHead>
              <TableHead>Request ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                <TableCell>{getTypeBadge(log.type)}</TableCell>
                <TableCell className="capitalize">{log.service}</TableCell>
                <TableCell className="font-mono text-xs">{log.endpoint}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.method}</Badge>
                </TableCell>
                <TableCell>{getStatusBadge(log.statusCode)}</TableCell>
                <TableCell>{log.responseTime}</TableCell>
                <TableCell className="font-mono text-xs">{log.requestId}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Log Details - {log.id}</DialogTitle>
                        <DialogDescription>Complete request and response information</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Request Information</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                <strong>Timestamp:</strong> {log.timestamp}
                              </div>
                              <div>
                                <strong>Endpoint:</strong> {log.endpoint}
                              </div>
                              <div>
                                <strong>Method:</strong> {log.method}
                              </div>
                              <div>
                                <strong>User ID:</strong> {log.userId || "N/A"}
                              </div>
                              {log.network && (
                                <div>
                                  <strong>Network:</strong> {log.network}
                                </div>
                              )}
                              {log.amount && (
                                <div>
                                  <strong>Amount:</strong> {log.amount}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Response Information</h4>
                            <div className="space-y-1 text-sm">
                              <div>
                                <strong>Status Code:</strong> {log.statusCode}
                              </div>
                              <div>
                                <strong>Response Time:</strong> {log.responseTime}
                              </div>
                              <div>
                                <strong>Request ID:</strong> {log.requestId}
                              </div>
                              {log.error && (
                                <div>
                                  <strong>Error:</strong> <span className="text-blue-800 font-medium">{log.error}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Request Payload</h4>
                            <ScrollArea className="h-32 w-full rounded border p-2">
                              <pre className="text-xs">{JSON.stringify(log.request, null, 2)}</pre>
                            </ScrollArea>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Response Payload</h4>
                            <ScrollArea className="h-32 w-full rounded border p-2">
                              <pre className="text-xs">{JSON.stringify(log.response, null, 2)}</pre>
                            </ScrollArea>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex justify-end">
          <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
            <Download className="mr-2 h-4 w-4" />
            Export Logs
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

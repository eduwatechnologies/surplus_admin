"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const servicesData = [
  {
    service: "MTN Airtime",
    totalTransactions: 15420,
    successRate: 98.5,
    failedTransactions: 231,
    averageResponseTime: "1.2s",
    status: "operational",
  },
  {
    service: "Airtel Data",
    totalTransactions: 8750,
    successRate: 97.8,
    failedTransactions: 192,
    averageResponseTime: "1.5s",
    status: "operational",
  },
  {
    service: "Glo Data",
    totalTransactions: 5230,
    successRate: 95.2,
    failedTransactions: 251,
    averageResponseTime: "2.1s",
    status: "operational",
  },
  {
    service: "9mobile Airtime",
    totalTransactions: 3120,
    successRate: 96.7,
    failedTransactions: 103,
    averageResponseTime: "1.8s",
    status: "operational",
  },
  {
    service: "DSTV Subscription",
    totalTransactions: 2540,
    successRate: 94.5,
    failedTransactions: 140,
    averageResponseTime: "3.2s",
    status: "operational",
  },
  {
    service: "NEPA Electricity",
    totalTransactions: 4320,
    successRate: 91.2,
    failedTransactions: 380,
    averageResponseTime: "2.5s",
    status: "degraded",
  },
  {
    service: "WAEC Result Checker",
    totalTransactions: 1250,
    successRate: 99.1,
    failedTransactions: 11,
    averageResponseTime: "1.0s",
    status: "operational",
  },
  {
    service: "Spectranet Data",
    totalTransactions: 980,
    successRate: 88.5,
    failedTransactions: 113,
    averageResponseTime: "3.5s",
    status: "issues",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "operational":
      return <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">Operational</Badge>
    case "degraded":
      return <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-50 border border-blue-200">Degraded</Badge>
    case "issues":
      return <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Issues</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ServicesPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Performance</CardTitle>
        <CardDescription>Track success rates and failed transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead className="text-right">Total Transactions</TableHead>
              <TableHead className="text-right">Success Rate</TableHead>
              <TableHead className="text-right">Failed Transactions</TableHead>
              <TableHead className="text-right">Avg. Response Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {servicesData.map((service) => (
              <TableRow key={service.service}>
                <TableCell className="font-medium">{service.service}</TableCell>
                <TableCell className="text-right">{service.totalTransactions.toLocaleString()}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      service.successRate > 95
                        ? "text-blue-600 font-medium"
                        : service.successRate > 90
                          ? "text-blue-500"
                          : "text-blue-800"
                    }
                  >
                    {service.successRate}%
                  </span>
                </TableCell>
                <TableCell className="text-right">{service.failedTransactions}</TableCell>
                <TableCell className="text-right">{service.averageResponseTime}</TableCell>
                <TableCell>{getStatusBadge(service.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

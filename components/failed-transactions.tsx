"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

const failedTransactions = [
  {
    id: "TXN004",
    user: "Sarah Wilson",
    userId: "USR004",
    type: "Airtime",
    network: "Glo",
    amount: "₦500",
    date: "2024-01-15 08:30 AM",
    reference: "REF456789012",
    reason: "Network timeout",
  },
  {
    id: "TXN007",
    user: "Jane Smith",
    userId: "USR002",
    type: "Bill Payment",
    network: "DSTV",
    amount: "₦8,000",
    date: "2024-01-14 14:10 PM",
    reference: "REF789012345",
    reason: "Invalid account number",
  },
  {
    id: "TXN012",
    user: "Mike Johnson",
    userId: "USR003",
    type: "Data Bundle",
    network: "MTN",
    amount: "₦3,500",
    date: "2024-01-14 11:25 AM",
    reference: "REF123987456",
    reason: "Insufficient wallet balance",
  },
  {
    id: "TXN018",
    user: "David Brown",
    userId: "USR005",
    type: "Electricity",
    network: "NEPA",
    amount: "₦10,000",
    date: "2024-01-13 16:40 PM",
    reference: "REF456123789",
    reason: "Service provider error",
  },
  {
    id: "TXN023",
    user: "John Doe",
    userId: "USR001",
    type: "Airtime",
    network: "Airtel",
    amount: "₦2,000",
    date: "2024-01-13 09:15 AM",
    reference: "REF789456123",
    reason: "Network timeout",
  },
]

export function FailedTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Failed Transactions</CardTitle>
        <CardDescription>Transactions that failed in the last 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Network/Provider</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Failure Reason</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {failedTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.user}</TableCell>
                <TableCell>{transaction.type}</TableCell>
                <TableCell>{transaction.network}</TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell className="text-muted-foreground">{transaction.date}</TableCell>
                <TableCell>
                  <span className="text-blue-800 font-medium">{transaction.reason}</span>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Retry
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

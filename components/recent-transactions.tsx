"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Transaction {
  transactionData: any;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "success":
      return <Badge className="bg-green-100 text-green-700">Success</Badge>;
    case "refund":
      return <Badge className="bg-green-100 text-green-700">Refund</Badge>;
    case "failed":
      return <Badge className="bg-red-100 text-red-700">Failed</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

export function RecentTransactions({ transactionData }: Transaction) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          Latest VTU transactions from your platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactionData.map((transaction: any) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">
                  TRNS{transaction._id.slice(-5)}
                </TableCell>
                <TableCell>{transaction.userId?.firstName || "N/A"}</TableCell>
                <TableCell>{transaction.service}</TableCell>
                <TableCell>
                  {transaction?.network?.toUpperCase() || "Fund"}
                </TableCell>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>
                  {transaction.status === "failed" && getStatusBadge("refund")}
                  {getStatusBadge(transaction.status)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

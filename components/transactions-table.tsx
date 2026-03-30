"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";

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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { fetchTransactions } from "@/lib/redux/slices/transactionSlice";

// badge formatter
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

export function TransactionsTable() {
  const dispatch = useAppDispatch();
  const {
    filteredTransactions,
    isLoading,
    currentPage,
    totalPages,
    totalTransactions,
  } = useAppSelector((state) => state.transactions);

  const [selectedTx, setSelectedTx] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch data when page changes
  useEffect(() => {
    dispatch(fetchTransactions(currentPage));
  }, [dispatch, currentPage]);

  const openModal = (tx: any) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTx(null);
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Loading transactions...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center p-6">
          <div className="animate-pulse h-40 flex items-center justify-center">
            Loading...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Showing {filteredTransactions.length} of {totalTransactions} total
            transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Network/Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction._id}>
                  <TableCell className="font-medium">
                    TRNS{transaction._id.slice(-5)}
                  </TableCell>
                  <TableCell>
                    {transaction.userId?.firstName || "N/A"}
                  </TableCell>
                  <TableCell>{transaction.userId?.email || "N/A"}</TableCell>
                  <TableCell className="capitalize">
                    {transaction.service}
                  </TableCell>
                  <TableCell className="capitalize">
                    {transaction.network || "Fund"}
                  </TableCell>
                  <TableCell>₦{transaction.amount?.toLocaleString()}</TableCell>
                  <TableCell>{transaction.mobile_no}</TableCell>
                  <TableCell>
                    {transaction.status === "failed" &&
                      getStatusBadge("refund")}
                    {getStatusBadge(transaction.status)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(
                      transaction.transaction_date
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openModal(transaction)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          <span>View log</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* ✅ Pagination Controls (server-side) */}
          <div className="w-full flex justify-center items-center mt-6">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Previous Button */}
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => dispatch(fetchTransactions(currentPage - 1))}
              >
                Previous
              </Button>

              {/* Dynamic Page Buttons */}
              {(() => {
                const pages = [];
                const maxButtons = 5; // how many visible pages around the current
                const startPage = Math.max(1, currentPage - 2);
                const endPage = Math.min(totalPages, currentPage + 2);

                // Always show the first page
                if (startPage > 1) {
                  pages.push(
                    <Button
                      key={1}
                      variant={currentPage === 1 ? "default" : "outline"}
                      onClick={() => dispatch(fetchTransactions(1))}
                    >
                      1
                    </Button>
                  );

                  if (startPage > 2) {
                    pages.push(<span key="start-ellipsis">...</span>);
                  }
                }

                // Middle pages
                for (let page = startPage; page <= endPage; page++) {
                  pages.push(
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      onClick={() => dispatch(fetchTransactions(page))}
                    >
                      {page}
                    </Button>
                  );
                }

                // Always show the last page
                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push(<span key="end-ellipsis">...</span>);
                  }

                  pages.push(
                    <Button
                      key={totalPages}
                      variant={
                        currentPage === totalPages ? "default" : "outline"
                      }
                      onClick={() => dispatch(fetchTransactions(totalPages))}
                    >
                      {totalPages}
                    </Button>
                  );
                }

                return pages;
              })()}

              {/* Next Button */}
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => dispatch(fetchTransactions(currentPage + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal for Transaction Details */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              {selectedTx?.status === "failed"
                ? "This transaction failed. See error details below."
                : "Full transaction details"}
            </DialogDescription>
          </DialogHeader>

          {selectedTx && (
            <div className="space-y-2 mt-4 text-sm">
              <p>
                <strong>User:</strong> {selectedTx.userId?.firstName || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {selectedTx.userId?.email || "N/A"}
              </p>
              <p>
                <strong>Service:</strong> {selectedTx.service}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    selectedTx.status === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {selectedTx.status}
                </span>
              </p>
              <p>
                <strong>Amount:</strong> ₦{selectedTx.amount?.toLocaleString()}
              </p>
              {selectedTx.network && (
                <p>
                  <strong>Network:</strong> {selectedTx.network}
                </p>
              )}
              {selectedTx.mobile_no && (
                <p>
                  <strong>Mobile No:</strong> {selectedTx.mobile_no}
                </p>
              )}
              {selectedTx.data_type && (
                <p>
                  <strong>Data Type:</strong> {selectedTx.data_type}
                </p>
              )}
              {selectedTx.previous_balance !== undefined && (
                <p>
                  <strong>Previous Balance:</strong> ₦
                  {selectedTx.previous_balance?.toLocaleString()}
                </p>
              )}
              {selectedTx.new_balance !== undefined && (
                <p>
                  <strong>New Balance:</strong> ₦
                  {selectedTx.new_balance?.toLocaleString()}
                </p>
              )}
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedTx.transaction_date).toLocaleString()}
              </p>
              {selectedTx.message && (
                <p>
                  <strong>Message:</strong> {selectedTx.message}
                </p>
              )}
              {selectedTx.reference_no && (
                <p>
                  <strong>Reference No:</strong> {selectedTx.reference_no}
                </p>
              )}
              {selectedTx.raw_response && (
                <div>
                  <strong>Raw Response:</strong>
                  <pre className="bg-gray-100 p-2 rounded text-sm max-h-48 overflow-auto w-96">
                    {JSON.stringify(
                      typeof selectedTx.raw_response === "string"
                        ? JSON.parse(selectedTx.raw_response)
                        : selectedTx.raw_response,
                      null,
                      2
                    )}
                  </pre>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button onClick={closeModal}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

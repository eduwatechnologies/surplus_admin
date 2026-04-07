"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { fetchUserDetail, updateUserRole, updateReferral } from "@/lib/redux/slices/userSlice";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Wallet, 
  CreditCard, 
  Activity, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Shield, 
  Building2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Transaction = {
  createdAt?: string;
  date?: string;
  amount: number | string;
  network?: string;
  mobile_no?: string;
  transaction_type?: string;
  status: "success" | "pending" | "failed";
  previous_balance?: string | number;
  new_balance?: string | number;
};

type TransactionTab =
  | "airtime"
  | "data"
  | "electricity"
  | "cable_tv"
  | "wallet"
  | "others";

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [newReferralCode, setNewReferralCode] = useState("");

  const {
    selectedUserDetail: user,
    transactions,
    detailLoading,
    referralStats,
    totalTransactionValue,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (id) dispatch(fetchUserDetail(id as string));
  }, [dispatch, id]);

  const getTotals = (txs: Transaction[] = []) => {
    const totalTransaction = txs.length;

    const successTxs = txs.filter((tx) => tx.status === "success");
    const failedTxs = txs.filter((tx) => tx.status === "failed");
    const pendingTxs = txs.filter((tx) => tx.status === "pending");

    const sumAmount = (list: Transaction[]) =>
      list.reduce((sum, tx) => sum + Number(tx.amount || 0), 0);

    return {
      totalTransaction,
      totalAmount: sumAmount(txs),
      successCount: successTxs.length,
      failedCount: failedTxs.length,
      pendingCount: pendingTxs.length,
      successAmount: sumAmount(successTxs),
      failedAmount: sumAmount(failedTxs),
      pendingAmount: sumAmount(pendingTxs),
    };
  };

  const allTxs: Transaction[] = [
    ...(transactions.airtime || []),
    ...(transactions.data || []),
    ...(transactions.electricity || []),
    ...(transactions.cable_tv || []),
    ...(transactions.wallet || []),
    ...(transactions.others || []),
  ];
  const allTotals = getTotals(allTxs);
  
  const handleUpdateRole = (newRole: string) => {
    if (user) {
      dispatch(updateUserRole({ userId: user._id, role: newRole }));
    }
  };

  const handleUpdateReferral = () => {
    if (user) {
      dispatch(updateReferral({ userId: user._id, newReferralCode }))
        .unwrap()
        .then(() => {
          setNewReferralCode("");
          alert("Referral updated successfully");
        })
        .catch((err: any) => {
          alert(`Failed to update referral: ${err}`);
        });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Failed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderTable = (data: Transaction[] = []) => (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Balance (Old → New)</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((tx, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {new Date(tx.createdAt || tx.date || "").toLocaleDateString()}
                  <div className="text-xs text-muted-foreground">
                    {new Date(tx.createdAt || tx.date || "").toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </TableCell>
                <TableCell>₦{Number(tx.amount).toLocaleString()}</TableCell>
                <TableCell className="capitalize">
                  {tx.network || tx.transaction_type?.replace('_', ' ')}
                </TableCell>
                <TableCell>{tx.mobile_no || "N/A"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {tx.previous_balance ? `₦${Number(tx.previous_balance).toLocaleString()}` : '-'} 
                  {' → '}
                  {tx.new_balance ? `₦${Number(tx.new_balance).toLocaleString()}` : '-'}
                </TableCell>

                <TableCell>{getStatusBadge(tx.status)}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderStatusTabs = (data: Transaction[] = []) => {
    const totals = getTotals(data);
    const successTxs = data.filter((tx) => tx.status === "success");
    const failedTxs = data.filter((tx) => tx.status === "failed");
    const pendingTxs = data.filter((tx) => tx.status === "pending");

    return (
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4 w-full flex-wrap h-auto justify-start bg-muted/30 p-1">
          <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            All ({totals.totalTransaction})
          </TabsTrigger>
          <TabsTrigger value="success" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Success ({totals.successCount})
          </TabsTrigger>
          <TabsTrigger value="failed" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Failed ({totals.failedCount})
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
            Pending ({totals.pendingCount})
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
            <p className="text-xs text-green-700 uppercase">Success Volume</p>
            <p className="text-lg font-semibold text-green-700">₦{totals.successAmount.toLocaleString()}</p>
          </div>
          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
            <p className="text-xs text-red-700 uppercase">Failed Volume</p>
            <p className="text-lg font-semibold text-red-700">₦{totals.failedAmount.toLocaleString()}</p>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
            <p className="text-xs text-yellow-700 uppercase">Pending Volume</p>
            <p className="text-lg font-semibold text-yellow-700">₦{totals.pendingAmount.toLocaleString()}</p>
          </div>
        </div>

        <TabsContent value="all">{renderTable(data)}</TabsContent>
        <TabsContent value="success">{renderTable(successTxs)}</TabsContent>
        <TabsContent value="failed">{renderTable(failedTxs)}</TabsContent>
        <TabsContent value="pending">{renderTable(pendingTxs)}</TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="space-y-8">
      {detailLoading ? (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Loading user details...</p>
            </div>
          ) : !user ? (
            <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
              <AlertCircle className="h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">User not found.</p>
              <Button onClick={() => router.back()}>Go Back</Button>
            </div>
          ) : (
            <>
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => router.back()}>
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <span>Users</span>
                    <span>/</span>
                    <span className="font-medium text-foreground">{user.firstName} {user.lastName}</span>
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight">User Details</h1>
                </div>
                <div className="flex items-center gap-2">
                   <Badge 
                    className={
                      user.status === "active" 
                        ? "bg-green-100 text-green-700 text-sm px-3 py-1 hover:bg-green-200 border-0" 
                        : "bg-red-100 text-red-700 text-sm px-3 py-1 hover:bg-red-200 border-0"
                    }
                  >
                    {user.status === "active" ? <CheckCircle2 className="w-3 h-3 mr-1"/> : <XCircle className="w-3 h-3 mr-1"/>}
                    {user.status?.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="shadow-sm border-none bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Wallet className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Wallet Balance</p>
                      <h3 className="text-2xl font-bold">₦{Number(user.balance).toLocaleString()}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Spent</p>
                      <h3 className="text-2xl font-bold">₦{totalTransactionValue.toLocaleString()}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Activity className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Transactions</p>
                      <h3 className="text-2xl font-bold">{allTotals.totalTransaction}</h3>
                      <p className="text-xs text-muted-foreground">
                        {allTotals.successCount} success • {allTotals.failedCount} failed • {allTotals.pendingCount} pending
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-sm border-none bg-white">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Referrals</p>
                      <h3 className="text-2xl font-bold">{referralStats?.totalReferrals || 0}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Sidebar: Profile Info */}
                <div className="space-y-6">
                  <Card className="shadow-sm border-none overflow-hidden">
                    <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                    <CardContent className="relative pt-0 px-6 pb-6">
                      <Avatar className="h-24 w-24 border-4 border-white absolute -top-24 left-1/2 -translate-x-1/2 shadow-sm">
                        <AvatarImage
                          src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`}
                          alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="text-lg font-bold">{user.firstName?.[0]}</AvatarFallback>
                      </Avatar>
                      
                      <div className="mt-14 space-y-1 text-center">
                        <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>

                      <div className="mt-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role Management</label>
                          <Select
                            defaultValue={user.role}
                            onValueChange={handleUpdateRole}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="manager">Manager</SelectItem>
                            </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 pt-4 border-t mt-4">
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Referred By</label>
                        <div className="flex gap-2">
                          <Input 
                            placeholder={user.referredBy || "No Referrer"} 
                            value={newReferralCode}
                            onChange={(e) => setNewReferralCode(e.target.value)}
                            className="h-9 text-sm"
                          />
                          <Button size="sm" onClick={handleUpdateReferral}>
                            Update
                          </Button>
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          Current: <span className="font-mono font-medium text-foreground">{user.referredBy || "None"}</span>. Leave empty to remove.
                        </p>
                      </div>
                      
                      <Separator />

                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span>{user.phone || "N/A"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{user.account ? `${user.account.bankName} - ${user.account.accountNumber}` : "No Bank Account"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.state || "State Not Set"}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <Shield className="h-4 w-4 text-muted-foreground" />
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Referral Detailed Stats */}
                  {referralStats && (
                    <Card className="shadow-sm border-none">
                      <CardHeader>
                        <CardTitle className="text-base">Referral Overview</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Total Earnings</span>
                          <span className="font-bold text-green-600">₦{referralStats.totalEarnings.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                          <span className="text-sm text-muted-foreground">Referral Code</span>
                          <span className="font-mono font-medium">{user?.referralCode || "N/A"}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Content: Tabs for Transactions & Referrals */}
                <div className="lg:col-span-2 space-y-6">
                  <Tabs defaultValue="transactions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                      <TabsTrigger value="transactions">Transaction History</TabsTrigger>
                      <TabsTrigger value="referrals">Referrals</TabsTrigger>
                    </TabsList>

                    {/* Transactions Tab */}
                    <TabsContent value="transactions">
                      <Card className="shadow-sm border-none h-full">
                        <CardHeader>
                          <CardTitle>Transaction History</CardTitle>
                          <CardDescription>View all transactions made by this user</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue="airtime" className="w-full">
                            <TabsList className="mb-6 w-full flex-wrap h-auto justify-start bg-muted/30 p-1">
                              {(
                                [
                                  "airtime",
                                  "data",
                                  "electricity",
                                  "cable_tv",
                                  "wallet",
                                  "others",
                                ] as TransactionTab[]
                              ).map((tab) => (
                                <TabsTrigger 
                                  key={tab} 
                                  value={tab}
                                  className="capitalize data-[state=active]:bg-white data-[state=active]:shadow-sm"
                                >
                                  {tab.replace("_", " ")}
                                </TabsTrigger>
                              ))}
                            </TabsList>

                            {(
                              [
                                "airtime",
                                "data",
                                "electricity",
                                "cable_tv",
                                "wallet",
                                "others",
                              ] as TransactionTab[]
                            ).map((tab) => {
                              const totals = getTotals(transactions[tab]);
                              return (
                                <TabsContent key={tab} value={tab} className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div className="bg-muted/30 p-3 rounded-lg border border-muted">
                                      <p className="text-xs text-muted-foreground uppercase">Count</p>
                                      <p className="text-lg font-semibold">{totals.totalTransaction}</p>
                                    </div>
                                    <div className="bg-muted/30 p-3 rounded-lg border border-muted">
                                      <p className="text-xs text-muted-foreground uppercase">Volume</p>
                                      <p className="text-lg font-semibold">₦{totals.totalAmount.toLocaleString()}</p>
                                    </div>
                                  </div>
                                  {renderStatusTabs(transactions[tab])}
                                </TabsContent>
                              );
                            })}
                          </Tabs>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    {/* Referrals Tab */}
                    <TabsContent value="referrals">
                      <Card className="shadow-sm border-none h-full">
                        <CardHeader>
                          <CardTitle>Referred Users</CardTitle>
                          <CardDescription>List of users referred by {user.firstName}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {referralStats && referralStats.referrals && referralStats.referrals.length > 0 ? (
                             <div className="space-y-3">
                              {referralStats.referrals.map((referral: any, index: number) => (
                                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                  <div>
                                    <p className="font-medium text-sm">{referral.firstName} {referral.lastName}</p>
                                    <p className="text-xs text-muted-foreground">{referral.email}</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-medium">{referral.phone || "N/A"}</p>
                                    <p className="text-xs text-muted-foreground">Phone</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-medium text-green-600">
                                      ₦{(referral.totalSpent || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Total Spent</p>
                                  </div>
                                  <div className="text-center">
                                    <p className="text-xs font-medium">
                                      {(referral.totalTransactionCount || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Transactions</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className="text-xs">
                                      {new Date(referral.createdAt).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                              <Users className="h-12 w-12 text-muted-foreground/30 mb-4" />
                              <h3 className="text-lg font-semibold">No Referrals Yet</h3>
                              <p className="text-muted-foreground">This user hasn't referred anyone yet.</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
    </div>
  );
}

"use client"

import { RevenueOverview } from "@/components/revenue-overview"
import { FailedTransactions } from "@/components/failed-transactions"

export default function RevenuePage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue Tracking</h1>
        <p className="text-muted-foreground">Monitor revenue and failed transactions</p>
      </div>

      <RevenueOverview />

      <FailedTransactions />
    </>
  )
}

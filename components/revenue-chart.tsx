"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Monthly revenue breakdown by service type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
              <span className="text-sm">Airtime</span>
            </div>
            <span className="text-sm font-medium">₦1,850,000 (45%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
              <span className="text-sm">Data Bundles</span>
            </div>
            <span className="text-sm font-medium">₦1,200,000 (30%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <span className="text-sm">Bill Payments</span>
            </div>
            <span className="text-sm font-medium">₦800,000 (20%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-500"></div>
              <span className="text-sm">Others</span>
            </div>
            <span className="text-sm font-medium">₦200,000 (5%)</span>
          </div>
        </div>

        <div className="mt-6 space-y-2">
          <div className="flex h-2 overflow-hidden rounded-full bg-muted">
            <div className="w-[45%] bg-blue-500"></div>
            <div className="w-[30%] bg-green-500"></div>
            <div className="w-[20%] bg-yellow-500"></div>
            <div className="w-[5%] bg-purple-500"></div>
          </div>
          <div className="text-center text-sm text-muted-foreground">Total Revenue: ₦4,050,000</div>
        </div>
      </CardContent>
    </Card>
  )
}

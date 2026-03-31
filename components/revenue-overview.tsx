"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function RevenueOverview() {
  const allowed = true

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <CardDescription>Track revenue by service type and time period</CardDescription>
      </CardHeader>
      <CardContent>
        {!allowed ? (
          <div className="p-4 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-800">
            Analytics is not available on your current plan.
          </div>
        ) : (
          <Tabs defaultValue="daily">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦450,000</div>
                  <p className="text-xs text-blue-600 font-medium">+12% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦67,500</div>
                  <p className="text-xs text-blue-600">15% of revenue</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3,245</div>
                  <p className="text-xs text-blue-600 font-medium">+8% from yesterday</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦138.67</div>
                  <p className="text-xs text-blue-600 font-medium">+3% from yesterday</p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Revenue by Service</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Airtime</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦202,500 (45%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "45%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Data Bundles</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦135,000 (30%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "30%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">Bill Payments</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦90,000 (20%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: "20%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm">Others</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦22,500 (5%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-purple-500" style={{ width: "5%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Revenue by Network</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm">MTN</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦180,000 (40%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-yellow-500" style={{ width: "40%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Airtel</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦135,000 (30%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-red-500" style={{ width: "30%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Glo</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦90,000 (20%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: "20%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">9mobile</span>
                      </div>
                      <span className="text-sm font-medium text-blue-600">₦45,000 (10%)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: "10%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly">{/* Similar structure as daily but with different numbers */}</TabsContent>

          <TabsContent value="monthly">{/* Similar structure as daily but with different numbers */}</TabsContent>

          <TabsContent value="yearly">{/* Similar structure as daily but with different numbers */}</TabsContent>
        </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

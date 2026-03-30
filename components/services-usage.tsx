"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ServicesUsage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Services Usage</CardTitle>
        <CardDescription>Monitor VTU services usage over time</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="daily">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="daily" className="space-y-4">
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Airtime</span>
                </div>
                <span className="text-sm font-medium text-blue-600">1,245 transactions</span>
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
                <span className="text-sm font-medium text-blue-600">876 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: "30%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                  <span className="text-sm">Electricity Bills</span>
                </div>
                <span className="text-sm font-medium text-blue-600">543 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-yellow-500" style={{ width: "20%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Cable TV</span>
                </div>
                <span className="text-sm font-medium text-blue-600">321 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: "15%" }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-pink-500"></div>
                  <span className="text-sm">Other Services</span>
                </div>
                <span className="text-sm font-medium text-blue-600">210 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-pink-500" style={{ width: "10%" }}></div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-4">
            {/* Similar content structure as daily but with different numbers */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Airtime</span>
                </div>
                <span className="text-sm font-medium text-blue-600">8,750 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "48%" }}></div>
              </div>
            </div>

            {/* Other services for weekly view */}
          </TabsContent>

          <TabsContent value="monthly" className="space-y-4">
            {/* Similar content structure as daily but with different numbers */}
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Airtime</span>
                </div>
                <span className="text-sm font-medium text-blue-600">35,245 transactions</span>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: "42%" }}></div>
              </div>
            </div>

            {/* Other services for monthly view */}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

// Mock system health data - in a real app, this would come from an API
const systemHealth = {
  apiStatus: "operational", // operational, degraded, down
  apiResponseTime: 230, // ms
  apiUptime: 99.98, // percentage
  databaseStatus: "operational", // operational, degraded, down
  databaseConnections: 42,
  databaseMaxConnections: 100,
  serverCpuUsage: 35, // percentage
  serverMemoryUsage: 68, // percentage
  serverDiskUsage: 52, // percentage
  lastChecked: new Date().toISOString(),
}

export function SystemHealthWidget() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "operational":
        return (
          <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Operational
          </Badge>
        )
      case "degraded":
        return (
          <Badge className="bg-yellow-100 text-yellow-600 hover:bg-yellow-100 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" /> Degraded
          </Badge>
        )
      case "down":
        return (
          <Badge className="bg-red-100 text-red-600 hover:bg-red-100 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> Down
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-blue-500"
    if (percentage < 80) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
        <CardDescription>Current status of system components</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">API Status</span>
            {getStatusBadge(systemHealth.apiStatus)}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Response Time</span>
            <span>{systemHealth.apiResponseTime}ms</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Uptime</span>
            <span>{systemHealth.apiUptime}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Database Status</span>
            {getStatusBadge(systemHealth.databaseStatus)}
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Connections</span>
            <span>
              {systemHealth.databaseConnections}/{systemHealth.databaseMaxConnections}
            </span>
          </div>
          <Progress
            value={(systemHealth.databaseConnections / systemHealth.databaseMaxConnections) * 100}
            className="h-2"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium">Server Resources</span>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">CPU Usage</span>
              <span>{systemHealth.serverCpuUsage}%</span>
            </div>
            <Progress
              value={systemHealth.serverCpuUsage}
              className={`h-2 ${getProgressColor(systemHealth.serverCpuUsage)}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Memory Usage</span>
              <span>{systemHealth.serverMemoryUsage}%</span>
            </div>
            <Progress
              value={systemHealth.serverMemoryUsage}
              className={`h-2 ${getProgressColor(systemHealth.serverMemoryUsage)}`}
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Disk Usage</span>
              <span>{systemHealth.serverDiskUsage}%</span>
            </div>
            <Progress
              value={systemHealth.serverDiskUsage}
              className={`h-2 ${getProgressColor(systemHealth.serverDiskUsage)}`}
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center pt-2">
          Last updated: {new Date(systemHealth.lastChecked).toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  )
}

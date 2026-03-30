"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { fetchActivityLogs } from "@/lib/redux/slices/staffSlice"
import { formatDistanceToNow } from "date-fns"
import { ArrowRight } from "lucide-react"

export function StaffActivityWidget() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { activityLogs } = useAppSelector((state) => state.staff)

  useEffect(() => {
    dispatch(fetchActivityLogs())
  }, [dispatch])

  // Get the most recent 5 logs
  const recentLogs = activityLogs.slice(0, 5)

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return "🟢"
      case "UPDATE":
        return "🔵"
      case "DELETE":
        return "🔴"
      case "LOGIN":
        return "🔑"
      case "LOGOUT":
        return "👋"
      case "VIEW":
        return "👁️"
      default:
        return "📝"
    }
  }

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (e) {
      return "Invalid date"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Staff Activity</CardTitle>
        <CardDescription>Latest actions performed by staff members</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                <div className="text-lg">{getActionIcon(log.action)}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{log.description}</p>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground">
                      {log.staffName} • {formatTime(log.timestamp)}
                    </p>
                    <span className="text-xs capitalize px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                      {log.module}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">No recent activity</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="ghost"
          className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          onClick={() => router.push("/activity-logs")}
        >
          View All Activity
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

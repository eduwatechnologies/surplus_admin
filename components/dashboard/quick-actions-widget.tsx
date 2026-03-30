"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { usePermissions } from "@/lib/rbac/permissions"
import { UserPlus, CreditCard, Wifi, Settings, RotateCcw } from "lucide-react"

export function QuickActionsWidget() {
  const router = useRouter()
  const { hasPermission } = usePermissions()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks you can perform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {hasPermission("perm_users_edit") && (
            <Button
              variant="outline"
              className="flex flex-col h-24 items-center justify-center gap-1"
              onClick={() => router.push("/users")}
            >
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span>Add User</span>
            </Button>
          )}

          {hasPermission("perm_transactions_manage") && (
            <Button
              variant="outline"
              className="flex flex-col h-24 items-center justify-center gap-1"
              onClick={() => router.push("/transactions")}
            >
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>New Transaction</span>
            </Button>
          )}

          {hasPermission("perm_services_manage") && (
            <Button
              variant="outline"
              className="flex flex-col h-24 items-center justify-center gap-1"
              onClick={() => router.push("/services")}
            >
              <Wifi className="h-5 w-5 text-blue-600" />
              <span>Manage Services</span>
            </Button>
          )}

          {hasPermission("perm_settings_manage") && (
            <Button
              variant="outline"
              className="flex flex-col h-24 items-center justify-center gap-1"
              onClick={() => router.push("/settings")}
            >
              <Settings className="h-5 w-5 text-blue-600" />
              <span>System Settings</span>
            </Button>
          )}

          {hasPermission("perm_transactions_manage") && (
            <Button
              variant="outline"
              className="flex flex-col h-24 items-center justify-center gap-1"
              onClick={() => router.push("/failed-transactions")}
            >
              <RotateCcw className="h-5 w-5 text-blue-600" />
              <span>Retry Failed</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

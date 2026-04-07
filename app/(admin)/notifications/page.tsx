"use client"

import { NotificationSettings } from "@/components/notification-settings"

export default function NotificationsPage() {
  return (
    <>
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">Create and manage push notifications sent to users.</p>
      </div>

      <NotificationSettings />
    </>
  )
}

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save } from "lucide-react"
import { useEffect, useState } from "react"
import axiosInstance from "@/app/api/auth/axiosInstance"

export function GeneralSettings() {
  const [brandName, setBrandName] = useState("")
  const [supportEmail, setSupportEmail] = useState("")
  const [supportPhone, setSupportPhone] = useState("")
  const [primaryColor, setPrimaryColor] = useState("")
  const [logoUrl, setLogoUrl] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    axiosInstance
      .get("/config/branding")
      .then((res) => {
        if (!mounted) return
        const d = res.data?.data || {}
        setBrandName(d.brandName || "")
        setSupportEmail(d.supportEmail || "")
        setSupportPhone(d.supportPhone || "")
        setPrimaryColor(d.primaryColor || "")
        setLogoUrl(d.logoUrl || "")
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const handleSaveSettings = async () => {
    setSaving(true)
    try {
      await axiosInstance.put("/config/branding", {
        brandName,
        supportEmail,
        supportPhone,
        primaryColor,
        logoUrl,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Configure general platform settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="platformName">Platform Name</Label>
              <Input id="platformName" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input id="supportEmail" type="email" value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input id="supportPhone" value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue="africa/lagos">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="africa/lagos">Africa/Lagos (WAT)</SelectItem>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="america/new_york">America/New_York (EST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select defaultValue="ngn">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ngn">Nigerian Naira (₦)</SelectItem>
                  <SelectItem value="usd">US Dollar ($)</SelectItem>
                  <SelectItem value="eur">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="primaryColor">Primary Color (hex)</Label>
              <Input id="primaryColor" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} placeholder="#0f172a" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input id="logoUrl" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" />
            </div>
          </div>

          <Button onClick={handleSaveSettings} className="text-white bg-blue-600 hover:bg-blue-700" disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Settings</CardTitle>
          <CardDescription>Configure security and access control settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="twoFactorAuth" />
            <Label htmlFor="twoFactorAuth">Require Two-Factor Authentication</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="sessionTimeout" defaultChecked />
            <Label htmlFor="sessionTimeout">Auto-logout after inactivity</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
            <Input id="sessionDuration" type="number" defaultValue="30" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="ipWhitelist" />
            <Label htmlFor="ipWhitelist">Enable IP Whitelisting</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="allowedIps">Allowed IP Addresses</Label>
            <Textarea id="allowedIps" placeholder="192.168.1.1, 10.0.0.1" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Mode</CardTitle>
          <CardDescription>Control platform availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch id="maintenanceMode" />
            <Label htmlFor="maintenanceMode">Enable Maintenance Mode</Label>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="maintenanceMessage">Maintenance Message</Label>
            <Textarea
              id="maintenanceMessage"
              placeholder="We are currently performing scheduled maintenance..."
              defaultValue="We are currently performing scheduled maintenance. Please check back later."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

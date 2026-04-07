"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import axiosInstance from "@/app/api/auth/axiosInstance"
import { Coins, Zap, Wifi, Tv, GraduationCap, Globe, Layers, ArrowRightLeft } from "lucide-react"

export function CommissionSettings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    agentCommission: 0,
    referralBonus: 0,
    minCommissionWithdrawal: 1000,
    transferFee: 0,
    stampDuty: 0,
    serviceCommissions: {
      airtime: 0,
      data: 0,
      electricity: 0,
      cable_tv: 0,
      exam_pin: 0,
      default: 0,
    }
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get("/auth/admin/settings")
      // Ensure serviceCommissions exists even if backend returns partial data
      const data = response.data
      if (!data.serviceCommissions) {
        data.serviceCommissions = {
          airtime: 0,
          data: 0,
          electricity: 0,
          cable_tv: 0,
          exam_pin: 0,
          default: 0,
        }
      }
      setSettings(data)
    } catch (error) {
      console.error("Failed to fetch settings:", error)
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      })
    }
  }

  const handleServiceCommissionChange = (service, value) => {
    setSettings(prev => ({
      ...prev,
      serviceCommissions: {
        ...prev.serviceCommissions,
        [service]: Number(value)
      }
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await axiosInstance.put("/auth/admin/settings", settings)
      toast({
        title: "Settings updated",
        description: "Commission settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
   

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <CardTitle>Service-Specific Agent Commissions</CardTitle>
          </div>
          <CardDescription>Set the flat commission amount (₦) agents earn for each service type transaction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-blue-100 rounded-full dark:bg-blue-900/20">
                  <Wifi className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <Label htmlFor="comm_airtime" className="font-semibold">Airtime</Label>
              </div>
              <Input
                id="comm_airtime"
                type="number"
                value={settings.serviceCommissions?.airtime || 0}
                onChange={(e) => handleServiceCommissionChange('airtime', e.target.value)}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-green-100 rounded-full dark:bg-green-900/20">
                  <Globe className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <Label htmlFor="comm_data" className="font-semibold">Data Bundle</Label>
              </div>
              <Input
                id="comm_data"
                type="number"
                value={settings.serviceCommissions?.data || 0}
                onChange={(e) => handleServiceCommissionChange('data', e.target.value)}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-yellow-100 rounded-full dark:bg-yellow-900/20">
                  <Zap className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                </div>
                <Label htmlFor="comm_electricity" className="font-semibold">Electricity</Label>
              </div>
              <Input
                id="comm_electricity"
                type="number"
                value={settings.serviceCommissions?.electricity || 0}
                onChange={(e) => handleServiceCommissionChange('electricity', e.target.value)}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
              <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-purple-100 rounded-full dark:bg-purple-900/20">
                  <Tv className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <Label htmlFor="comm_cable" className="font-semibold">Cable TV</Label>
              </div>
              <Input
                id="comm_cable"
                type="number"
                value={settings.serviceCommissions?.cable_tv || 0}
                onChange={(e) => handleServiceCommissionChange('cable_tv', e.target.value)}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-red-100 rounded-full dark:bg-red-900/20">
                  <GraduationCap className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <Label htmlFor="comm_exam" className="font-semibold">Exam Pin</Label>
              </div>
              <Input
                id="comm_exam"
                type="number"
                value={settings.serviceCommissions?.exam_pin || 0}
                onChange={(e) => handleServiceCommissionChange('exam_pin', e.target.value)}
              />
            </div>

            <div className="space-y-2 border p-4 rounded-lg bg-card/50">
               <div className="flex items-center gap-2 mb-2">
                 <div className="p-2 bg-gray-100 rounded-full dark:bg-gray-800">
                  <Layers className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <Label htmlFor="comm_default" className="font-semibold">Default (Others)</Label>
              </div>
              <Input
                id="comm_default"
                type="number"
                value={settings.serviceCommissions?.default || 0}
                onChange={(e) => handleServiceCommissionChange('default', e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button onClick={handleSave} disabled={loading} size="lg">
              {loading ? "Saving Changes..." : "Save Commission Settings"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

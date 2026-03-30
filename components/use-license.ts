"use client"
import { useEffect, useState } from "react"
import axiosInstance from "@/app/api/auth/axiosInstance"

export type LicenseInfo = {
  mode: string
  status: string
  tier: string | null
  expiresAt: string | null
  features: Record<string, any>
  customer: string | null
}

function isTierAtLeast(info: LicenseInfo | null, minTier: "basic" | "pro" | "enterprise") {
  if (!info) return true
  const mode = (info.mode || "off").toLowerCase()
  if (mode === "off") return true
  const tier = (info.tier || "basic").toLowerCase()
  if (minTier === "basic") return true
  if (minTier === "pro") return tier === "pro" || tier === "enterprise"
  return tier === "enterprise"
}

function isAnalyticsEnabled(info: LicenseInfo | null) {
  if (!info) return true
  const mode = (info.mode || "off").toLowerCase()
  if (mode === "off") return true
  const tier = (info.tier || "basic").toLowerCase()
  if (tier === "pro" || tier === "enterprise") return true
  if (info.features && info.features.analytics === true) return true
  return false
}

function isProviderManagerEnabled(info: LicenseInfo | null) {
  if (isTierAtLeast(info, "pro")) return true
  if (info?.features && info.features.provider_manager === true) return true
  return false
}

export function useLicense() {
  const [info, setInfo] = useState<LicenseInfo | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let mounted = true
    axiosInstance
      .get("/license/status")
      .then((res) => {
        if (!mounted) return
        setInfo(res.data)
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoaded(true)
      })
    return () => {
      mounted = false
    }
  }, [])

  return {
    info,
    loaded,
    analyticsAllowed: isAnalyticsEnabled(info),
    providerManagerAllowed: isProviderManagerEnabled(info),
  }
}


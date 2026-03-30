"use client"
import { useEffect, useState } from "react"
import axiosInstance from "@/app/api/auth/axiosInstance"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLicense } from "@/components/use-license"

type ProviderState = {
  vtpass: { publicKey?: string; apiKey?: string; secretKey?: string; baseUrl?: string }
  easyAccess: { apiKey?: string; baseUrl?: string }
  autopilot: { apiKey?: string; baseUrl?: string }
}

export function ApiSettings() {
  const [state, setState] = useState<ProviderState>({
    vtpass: {},
    easyAccess: {},
    autopilot: {},
  })
  const [saving, setSaving] = useState(false)
  const { providerManagerAllowed } = useLicense()

  useEffect(() => {
    let mounted = true
    axiosInstance
      .get("/config/providers")
      .then((res) => {
        if (!mounted) return
        const d = res.data?.data || {}
        setState({
          vtpass: {
            publicKey: d?.vtpass?.publicKey || "",
            apiKey: "",
            secretKey: "",
            baseUrl: d?.vtpass?.baseUrl || "",
          },
          easyAccess: {
            apiKey: "",
            baseUrl: d?.easyAccess?.baseUrl || "",
          },
          autopilot: {
            apiKey: "",
            baseUrl: d?.autopilot?.baseUrl || "",
          },
        })
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  const save = async () => {
    if (!providerManagerAllowed) return
    setSaving(true)
    try {
      await axiosInstance.put("/config/providers", state)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Provider API Settings</CardTitle>
        <CardDescription>Configure provider credentials and endpoints</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!providerManagerAllowed && (
          <div className="p-4 rounded-md border border-yellow-300 bg-yellow-50 text-sm text-yellow-800">
            Provider management is not available on your current plan.
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold">VTpass</h3>
            <div className="grid gap-2">
              <Label>Public Key</Label>
              <Input
                value={state.vtpass.publicKey || ""}
                onChange={(e) => setState((s) => ({ ...s, vtpass: { ...s.vtpass, publicKey: e.target.value } }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={state.vtpass.apiKey || ""}
                onChange={(e) => setState((s) => ({ ...s, vtpass: { ...s.vtpass, apiKey: e.target.value } }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Secret Key</Label>
              <Input
                type="password"
                value={state.vtpass.secretKey || ""}
                onChange={(e) => setState((s) => ({ ...s, vtpass: { ...s.vtpass, secretKey: e.target.value } }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Base URL</Label>
              <Input
                value={state.vtpass.baseUrl || ""}
                onChange={(e) => setState((s) => ({ ...s, vtpass: { ...s.vtpass, baseUrl: e.target.value } }))}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">EasyAccess</h3>
            <div className="grid gap-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={state.easyAccess.apiKey || ""}
                onChange={(e) => setState((s) => ({ ...s, easyAccess: { ...s.easyAccess, apiKey: e.target.value } }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Base URL</Label>
              <Input
                value={state.easyAccess.baseUrl || ""}
                onChange={(e) => setState((s) => ({ ...s, easyAccess: { ...s.easyAccess, baseUrl: e.target.value } }))}
              />
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-semibold">Autopilot</h3>
            <div className="grid gap-2">
              <Label>API Key</Label>
              <Input
                type="password"
                value={state.autopilot.apiKey || ""}
                onChange={(e) => setState((s) => ({ ...s, autopilot: { ...s.autopilot, apiKey: e.target.value } }))}
              />
            </div>
            <div className="grid gap-2">
              <Label>Base URL</Label>
              <Input
                value={state.autopilot.baseUrl || ""}
                onChange={(e) => setState((s) => ({ ...s, autopilot: { ...s.autopilot, baseUrl: e.target.value } }))}
              />
            </div>
          </div>
        </div>
        <Button onClick={save} disabled={saving || !providerManagerAllowed}>{saving ? "Saving..." : "Save"}</Button>
      </CardContent>
    </Card>
  )
}

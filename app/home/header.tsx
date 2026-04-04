"use client"
import { useEffect, useState } from "react"
import { Menu, Phone, X } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [brandName, setBrandName] = useState(process.env.NEXT_PUBLIC_BRAND_NAME || "Surplus TopUp")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [primaryColor, setPrimaryColor] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || ""

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL
    if (!base) return
    fetch(`${base}/api/public/branding`)
      .then((r) => r.json())
      .then((json) => {
        const d = json?.data || {}
        if (typeof d.brandName === "string" && d.brandName.trim()) setBrandName(d.brandName)
        if (typeof d.logoUrl === "string") setLogoUrl(d.logoUrl || null)
        if (typeof d.primaryColor === "string") setPrimaryColor(d.primaryColor || null)
      })
      .catch(() => {})
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {logoUrl ? (
              <div className="h-9 w-9 rounded-lg bg-white overflow-hidden border border-slate-200">
                <img src={logoUrl} alt={brandName} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div
                className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm"
                style={primaryColor ? { backgroundColor: primaryColor } : { backgroundColor: "var(--brand-600)" }}
              >
                <Phone className="h-5 w-5" />
              </div>
            )}
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">{brandName}</span>
              <span className="text-xs text-slate-500">Merchant VTU storefronts</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#services" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it works</a>
            <a href="#testimonials" className="text-slate-600 hover:text-slate-900 transition-colors">Stories</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {adminUrl ? (
              <a
                href={adminUrl}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Merchant portal
              </a>
            ) : null}
            <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm"
              style={primaryColor ? { backgroundColor: primaryColor } : { backgroundColor: "var(--brand-600)" }}
            >
              Create account
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-md border border-slate-300 p-2 text-slate-700"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4">
            <div className="grid gap-2 rounded-lg border border-slate-200 bg-white p-3">
              <a href="#services" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                How it works
              </a>
              <a href="#testimonials" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                Stories
              </a>
              <a href="#faq" className="rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                FAQ
              </a>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {adminUrl ? (
                  <a
                    href={adminUrl}
                    className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    onClick={() => setOpen(false)}
                  >
                    Merchant portal
                  </a>
                ) : null}
                <Link href="/login" className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold text-white"
                  style={primaryColor ? { backgroundColor: primaryColor } : { backgroundColor: "var(--brand-600)" }}
                  onClick={() => setOpen(false)}
                >
                  Create account
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

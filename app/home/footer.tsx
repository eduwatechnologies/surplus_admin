"use client";
import Link from "next/link"
import { useEffect, useState } from "react"
import { Mail, MapPin, Phone } from "lucide-react"

export function Footer() {
  const [brandName, setBrandName] = useState(process.env.NEXT_PUBLIC_BRAND_NAME || "Surplus TopUp")
  const [supportEmail, setSupportEmail] = useState<string | null>(null)
  const [supportPhone, setSupportPhone] = useState<string | null>(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL
    if (!base) return
    fetch(`${base}/api/public/branding`)
      .then((r) => r.json())
      .then((json) => {
        const d = json?.data || {}
        if (typeof d.brandName === "string" && d.brandName.trim()) setBrandName(d.brandName)
        if (typeof d.supportEmail === "string") setSupportEmail(d.supportEmail || null)
        if (typeof d.supportPhone === "string") setSupportPhone(d.supportPhone || null)
      })
      .catch(() => {})
  }, [])

  return (
    <footer id="contact" className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">{brandName}</h3>
            <p className="mt-3 text-sm text-slate-300 max-w-sm">
              Launch a branded VTU storefront, set your own prices, and sell to customers from your own link.
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-200">
                <Phone className="h-4 w-4 brand-icon" />
                <span>{supportPhone || "+234 800 000 0000"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Mail className="h-4 w-4 brand-icon" />
                <span>{supportEmail || "support@example.com"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <MapPin className="h-4 w-4 brand-icon" />
                <span>Nigeria</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90">Product</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><a href="#services" className="hover:text-white">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-white">How it works</a></li>
              <li><a href="#testimonials" className="hover:text-white">Stories</a></li>
              <li><a href="#faq" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90">Account</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-300">
              <li><Link href="/login" className="hover:text-white">Sign in</Link></li>
              <li><Link href="/signup" className="hover:text-white">Create account</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white/90">Get updates</h3>
            <p className="mt-4 text-sm text-slate-300">
              Subscribe for updates and announcements.
            </p>
            <div className="mt-4 flex gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-white placeholder:text-slate-400 outline-none ring-1 ring-inset ring-white/10 focus:ring-2 brand-focus-ring"
              />
              <button className="rounded-lg brand-bg px-4 py-2 text-sm font-semibold text-white">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-400">
            &copy; {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built for merchants, agents, and resellers.
          </p>
        </div>
      </div>
    </footer>
  )
}

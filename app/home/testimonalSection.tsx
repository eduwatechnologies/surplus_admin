"use client";
import React from "react";
import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Built for merchants and POS agents
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            Real feedback from people using the platform to sell VTU online.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sodiq A.",
              role: "POS Agent",
              comment: "I created my store, shared my link and started earning. Customers love the fast delivery.",
            },
            {
              name: "Ada O.",
              role: "Merchant",
              comment: "The branding and pricing control is exactly what I needed. It feels like my own VTU website.",
            },
            {
              name: "Chuka I.",
              role: "Reseller",
              comment: "Transparent pricing and clean receipts. Managing sales is easier than my old manual process.",
            },
          ].map((t, idx) => {
            const initial = (t.name.trim()[0] || "U").toUpperCase()
            return (
              <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold">
                      {initial}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-700 leading-relaxed">“{t.comment}”</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  );
}

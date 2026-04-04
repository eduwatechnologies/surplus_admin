"use client"
import React from "react";
import { CheckCircle, Clock, Shield, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "10K+", label: "Merchants onboarded" },
  { icon: CheckCircle, value: "99.9%", label: "Success rate" },
  { icon: Clock, value: "< 10m", label: "Store setup time" },
  { icon: Shield, value: "Secure", label: "Wallet & payments" }
];

export function StatsSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Launch fast. Sell confidently.
            </h2>
            <p className="mt-4 text-slate-600 text-base sm:text-lg max-w-xl">
              Register as a merchant, brand your page, set your prices, and start selling. We handle fulfillment and keep everything tracked.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold">
                  1
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Create your merchant account</div>
                  <div className="text-sm text-slate-600">Sign up and verify your details to access merchant tools.</div>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold">
                  2
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Brand your page & set pricing</div>
                  <div className="text-sm text-slate-600">Upload logo, choose color, and set your selling prices.</div>
                </div>
              </div>
              <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold">
                  3
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Share your link & earn</div>
                  <div className="text-sm text-slate-600">Customers buy from your storefront and you track every sale.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-8">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-5">
                  <stat.icon className="h-6 w-6 brand-text" />
                  <div className="mt-3 text-2xl font-bold text-slate-900">{stat.value}</div>
                  <div className="mt-1 text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-xs text-slate-500">
              Performance depends on network providers and connectivity.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

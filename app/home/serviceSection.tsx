"use client";
import { ArrowRight, Check, CreditCard, Smartphone, Tv, Wifi, Zap } from "lucide-react";
import Link from "next/link";

export function ServiceSection() {
  const services = [
    {
      icon: Smartphone,
      title: "Branded Storefront",
      description:
        "Get your own merchant landing page with your logo, name, color, and link you can share anywhere.",
      features: [
        "Your logo & brand",
        "Unique merchant link",
        "Mobile friendly",
        "Ready in minutes",
      ],
      price: "Free setup",
    },
    {
      icon: Wifi,
      title: "Set Your Prices",
      description:
        "Control your selling price per plan. Customers see your price and the platform price for transparency.",
      features: [
        "Plan-by-plan pricing",
        "Fixed or markup pricing",
        "Price floors enforced",
        "Instant updates",
      ],
      price: "Full control",
    },
    {
      icon: Zap,
      title: "Instant Fulfillment",
      description:
        "We handle delivery through reliable providers, with instant receipts and full transaction history.",
      features: ["Airtime & data", "Bills & TV", "Fast delivery", "Auto receipts"],
      price: "Always on",
    },
    {
      icon: Tv,
      title: "Wallet & Tracking",
      description:
        "Fund your wallet, monitor performance, and track every sale from your dashboard.",
      features: ["Wallet funding", "Transaction history", "Customer receipts", "Support ready"],
      price: "Built for POS",
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Everything a VTU merchant needs
          </h2>
          <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto">
            Start selling VTU online without building a website. Set your price, share your link, and earn from every transaction.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-slate-900 text-white shadow-sm">
                  <service.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-[color:var(--brand-700)] bg-[color:var(--brand-50)] border border-[color:var(--brand-200)] px-2 py-1 rounded-full">
                  {service.price}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-slate-600 mb-5">{service.description}</p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-slate-600"
                  >
                    <Check className="w-4 h-4 brand-text mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/signup" className="inline-flex items-center text-sm font-semibold text-slate-900 group-hover:text-[color:var(--brand-700)]">
                Create store
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-12 flex items-center justify-center">
          <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">
            Create a merchant account
            <CreditCard className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

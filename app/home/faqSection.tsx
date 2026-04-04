"use client";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "Do I need to know how to build a website?",
    answer:
      "No. Once you register, you get a ready-to-use merchant storefront with your own link. You can add your logo, brand name, and colors without any coding.",
  },
  {
    question: "Can I set my own prices as a POS agent/merchant?",
    answer:
      "Yes. You can set your selling price per plan (or use markup rules). We also keep the platform price available for transparency.",
  },
  {
    question: "How do customers buy from my storefront?",
    answer:
      "Share your merchant link. Customers can register or sign in and purchase airtime, data, and bills through your branded page.",
  },
  {
    question: "How do I fund my wallet to start selling?",
    answer:
      "Fund your wallet via bank transfer. Your wallet balance is used to fulfill customer transactions instantly.",
  },
  {
    question: "Can I use my own domain name?",
    answer:
      "Yes (optional). You can start with a free merchant link, and later upgrade to a custom domain when enabled on your plan.",
  },
  {
    question: "What happens if a transaction fails?",
    answer:
      "Failed transactions are tracked with full history. Where applicable, refunds are processed back to the wallet automatically after reconciliation.",
  },
];

export function FaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-slate-600">
            Quick answers for merchants and POS agents.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <span className="font-semibold text-slate-900">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform ${
                    openFaq === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === index && (
                <div className="px-6 pb-5">
                  <p className="text-slate-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

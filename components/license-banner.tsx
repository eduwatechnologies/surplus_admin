"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/app/api/auth/axiosInstance";

type LicenseInfo = {
  mode: string;
  status: string;
  tier: string | null;
  expiresAt: string | null;
  features: Record<string, any>;
  customer: string | null;
};

export default function LicenseBanner() {
  const [info, setInfo] = useState<LicenseInfo | null>(null);

  useEffect(() => {
    let mounted = true;
    axiosInstance
      .get("/license/status")
      .then((res) => {
        if (mounted) setInfo(res.data);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!info) return null;

  const mode = (info.mode || "off").toLowerCase();
  const invalid = info.status !== "valid" && mode !== "off";
  let expiring = false;
  if (info.expiresAt) {
    const d = new Date(info.expiresAt).getTime() - Date.now();
    expiring = d > 0 && d < 7 * 24 * 60 * 60 * 1000;
  }

  if (!invalid && !expiring) return null;

  const text = invalid
    ? "License invalid or missing. Some features may be unavailable."
    : "License expiring soon.";

  return (
    <div className="w-full bg-yellow-100 border-b border-yellow-300 text-yellow-800 text-sm px-4 py-2">
      {text}
    </div>
  );
}

import type React from "react";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ReduxProvider } from "@/components/providers/redux-provider";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import LicenseBanner from "@/components/license-banner";

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_BRAND_NAME || "Almaleek"} Dashboard`,
  description: "Admin dashboard for VTU services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50">
        <AuthProvider>
          <ReduxProvider>
            <LicenseBanner />
            {children}
          </ReduxProvider>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

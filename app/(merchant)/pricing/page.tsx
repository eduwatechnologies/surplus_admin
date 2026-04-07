import { Suspense } from "react";
import PricingClient from "./pricingClient";

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-muted/20">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
            <div className="text-sm text-muted-foreground">Loading pricing...</div>
          </div>
        </div>
      }
    >
      <PricingClient />
    </Suspense>
  );
}

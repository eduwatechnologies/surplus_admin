"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

function LoginPageInner() {
  const toast = useToast();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  // Check for error from URL params (e.g., redirected from NextAuth)
  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam) {
      toast.toast({
        title: "Login Failed",
        description: decodeURIComponent(errorParam),
        variant: "destructive",
      });
    }
  }, [errorParam]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Try staff login first
      try {
        const res = await axiosInstance.post("/staff/login", { email, password }, { proxy: false });
        const { staff, token } = res.data || {};
        if (!token || !staff) throw new Error("Invalid staff response");
        setAuth({
          user: {
            id: staff.id || staff._id || "",
            name: staff.name || "Admin",
            email: staff.email || email,
            role: staff.role || "admin",
          },
          token,
        });
        const callbackUrl = searchParams.get("callbackUrl") || "/";
        window.location.href = callbackUrl;
        return;
      } catch (e) {
        // Fallback to merchant login
      }

      const res = await axiosInstance.post("/auth/login", { email, password }, { proxy: false });
      const { accessToken, user } = res.data || {};
      const role = user?.role;
      if (!accessToken || !user) throw new Error("Invalid response from server");
      if (role !== "merchant" && role !== "reseller") {
        try {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          document.cookie = "admin_token=; Max-Age=0; path=/; SameSite=Lax";
        } catch {}
        throw new Error("This account cannot access the admin portal");
      }
      setAuth({
        user: {
          id: user.id || user._id || "",
          name: user.email || "Merchant",
          email: user.email || email,
          role: role || "user",
        },
        token: accessToken,
      });
      window.location.href = "/settings";
    } catch (error) {
      console.error("Login error:", error);
      const msg =
        (error as any)?.response?.data?.error ||
        (error as any)?.response?.data?.msg ||
        (error as any)?.message ||
        "Login failed";
      setError(msg);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[color:var(--brand-50)] to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-xl bg-white/70 backdrop-blur border-slate-200">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white shadow brand-bg">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">VTU Admin</CardTitle>
          <CardDescription>Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full text-white brand-bg"
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
        <CardFooter className="flex justify-center">
          <a href="/signup" className="brand-text hover:underline text-sm">
            Create a merchant account
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

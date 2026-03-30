"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useAuth } from "@/components/providers/auth-provider";

export default function LoginPage() {
  const toast = useToast();
  const { setAuth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
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
      const res = await axiosInstance.post("/staff/login", { email, password }, { proxy: false });
      const { staff, token } = res.data || {};

      if (!token || !staff) throw new Error("Invalid response from server");

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
    } catch (error) {
      console.error("Login error:", error);
      const msg = (error as any)?.response?.data?.msg || (error as any)?.message || "Login failed";
      setError(msg);
    }
    setIsLoading(false);
  };



  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Zap className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Almaleek
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
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
                placeholder="admin@vtuadmin.com"
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
              className="w-full text-white bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

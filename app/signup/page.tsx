"use client";
import { useState } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from "@/app/api/auth/axiosInstance";
import { useAuth } from "@/components/providers/auth-provider";

export default function MerchantSignupPage() {
  const toast = useToast();
  const { setAuth } = useAuth();
  const brandNameHeader = process.env.NEXT_PUBLIC_BRAND_NAME || "Surplus TopUp";
  const steps = ["Account", "Store", "Support"] as const;
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [stateName, setStateName] = useState("");
  const [password, setPassword] = useState("");
  const [slug, setSlug] = useState("");
  const [brandName, setBrandName] = useState("");
  const [logo, setLogo] = useState("");
  const [primaryColorInput, setPrimaryColorInput] = useState("");
  const [supportEmail, setSupportEmail] = useState("");
  const [supportPhone, setSupportPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = steps.length <= 1 ? 0 : Math.round(((step - 1) / (steps.length - 1)) * 100);

  const validateStep = () => {
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedSlug = slug.trim();
    if (step === 1) {
      if (!firstName.trim()) return "First name is required";
      if (!lastName.trim()) return "Last name is required";
      if (!trimmedEmail) return "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) return "Enter a valid email";
      if (!trimmedPhone) return "Phone is required";
      if (!/^[0-9]{10,15}$/.test(trimmedPhone.replace(/\s/g, ""))) return "Enter a valid phone number";
      if (!stateName.trim()) return "State is required";
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters";
      return null;
    }

    if (step === 2) {
      if (!trimmedSlug) return "Merchant slug is required";
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trimmedSlug)) return "Slug can only contain lowercase letters, numbers, and hyphens";
      if (trimmedSlug.length < 3) return "Slug must be at least 3 characters";
      if (primaryColorInput.trim() && !/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(primaryColorInput.trim())) {
        return "Primary color must be a valid hex color (e.g. #e11d48)";
      }
      if (logo.trim() && !/^https?:\/\//i.test(logo.trim())) return "Logo URL must start with http:// or https://";
      return null;
    }

    return null;
  };

  const next = () => {
    const v = validateStep();
    if (v) {
      setError(v);
      return;
    }
    setError("");
    setStep((s) => Math.min(steps.length, s + 1));
  };

  const back = () => {
    setError("");
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFormSubmit = (e: any) => {
    if (step < steps.length) {
      e.preventDefault();
      next();
      return;
    }
    submit(e);
  };

  const submit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.post(
        "/auth/merchant/signup",
        {
          firstName,
          lastName,
          email,
          phone,
          state: stateName,
          password,
          slug,
          brandName,
          logoUrl: logo,
          primaryColor: primaryColorInput,
          supportEmail,
          supportPhone,
        },
        { proxy: false }
      );
      const { accessToken, user } = res.data || {};
      if (!accessToken || !user) throw new Error("Invalid response from server");
      setAuth({
        user: {
          id: user.id || user._id || "",
          name: user.email || email,
          email: user.email || email,
          role: user.role || "merchant",
        },
        token: accessToken,
      });
      toast.toast({ title: "Success", description: "Merchant account created" });
      window.location.href = "/settings";
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || "Failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[color:var(--brand-50)] to-white">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/70 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white shadow-sm brand-bg">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-sm font-semibold text-slate-900">{brandNameHeader}</span>
                <span className="text-xs text-slate-500">Merchant admin portal</span>
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Merchant Account</h1>
          <p className="text-slate-600 mt-1">Create your merchant profile and start selling instantly.</p>
          <div className="mt-6">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>
                Step {step} of {steps.length}:{" "}
                <span className="font-semibold text-slate-900">{steps[step - 1]}</span>
              </span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full rounded-full brand-bg transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {steps.map((label, idx) => {
                const n = idx + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <div
                    key={label}
                    className={[
                      "rounded-lg border px-3 py-2 text-center text-xs font-medium",
                      done ? "border-[color:var(--brand-200)] bg-[color:var(--brand-50)] text-[color:var(--brand-700)]" : "",
                      active ? "border-slate-300 bg-white text-slate-900" : "",
                      !active && !done ? "border-slate-200 bg-slate-50 text-slate-500" : "",
                    ].join(" ")}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
          </div>
          {error ? <div className="mt-4 p-3 text-sm bg-red-50 text-red-600 rounded-md">{error}</div> : null}
          <form className="mt-6 space-y-4" onSubmit={handleFormSubmit}>
            {step === 1 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>First name</Label>
                    <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last name</Label>
                    <Input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="080..." autoComplete="tel" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>State</Label>
                    <Input value={stateName} onChange={(e) => setStateName(e.target.value)} placeholder="Lagos" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Password</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" required />
                  </div>
                </div>
              </>
            ) : null}

            {step === 2 ? (
              <>
                <div className="space-y-2">
                  <Label>Merchant slug</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="almaleek" required />
                  <p className="text-xs text-slate-500">Your storefront will be available at /m/{slug || "[slug]"}</p>
                </div>
                <div className="space-y-2">
                  <Label>Brand name</Label>
                  <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Almaleek" />
                </div>
                <div className="space-y-2">
                  <Label>Primary color</Label>
                  <Input value={primaryColorInput} onChange={(e) => setPrimaryColorInput(e.target.value)} placeholder="#e11d48" />
                </div>
                <div className="space-y-2">
                  <Label>Logo URL</Label>
                  <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://..." />
                </div>
              </>
            ) : null}

            {step === 3 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Support email</Label>
                    <Input value={supportEmail} onChange={(e) => setSupportEmail(e.target.value)} placeholder="support@domain.com" />
                  </div>
                  <div className="space-y-2">
                    <Label>Support phone</Label>
                    <Input value={supportPhone} onChange={(e) => setSupportPhone(e.target.value)} placeholder="080..." />
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                  <div className="grid grid-cols-1 gap-1 text-slate-700">
                    <div>
                      <span className="font-semibold text-slate-900">Name:</span> {firstName} {lastName}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Email:</span> {email}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Phone:</span> {phone}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900">Slug:</span> {slug}
                    </div>
                  </div>
                </div>
              </>
            ) : null}

            <div className="flex items-center gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={back} disabled={loading || step === 1}>
                Back
              </Button>
              {step < steps.length ? (
                <Button type="button" className="flex-1 text-white brand-bg" onClick={next} disabled={loading}>
                  Next
                </Button>
              ) : (
                <Button type="submit" className="flex-1 text-white brand-bg" disabled={loading}>
                  {loading ? "Creating..." : "Create Merchant"}
                </Button>
              )}
            </div>
          </form>
          <p className="text-sm text-slate-600 mt-4">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          </p>
        </div>
      </main>
    </div>
  );
}

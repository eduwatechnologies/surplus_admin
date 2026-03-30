"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import {
  createProvider,
  updateProvider,
  fetchProviders,
} from "@/lib/redux/slices/networkProviderSlice";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save } from "lucide-react";
import { ApTextInput } from "@/components/commons/textInput";
import { useToast } from "@/hooks/use-toast";
import { ApButton } from "@/components/commons/butons/button";

export default function NetworkProviderForm({
  initialData,
  onClose,
}: {
  initialData?: any;
  onClose: () => void;
}) {
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(
    (state: RootState) => state.networkProviders.loading
  );

  const [initialValues, setInitialValues] = useState({
    provider: "",
    baseUrl: "",
    token: "",
    publicKey: "",
    secretKey: "",
    autoWalletFunding: false,
    enabled: true,
    testMode: true,
    webhook: {
      url: "",
      secret: "",
      events: "topup.success,topup.failed",
      enabled: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setInitialValues({
        ...initialData,
        webhook: {
          ...initialData.webhook,
          events: Array.isArray(initialData.webhook.events)
            ? initialData.webhook.events.join(",")
            : initialData.webhook.events,
        },
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    nested = false
  ) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { name, value, type } = target;
    const checked = (target as HTMLInputElement).checked;

    if (nested) {
      setInitialValues((prev) => ({
        ...prev,
        webhook: {
          ...prev.webhook,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setInitialValues((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...initialValues,
      webhook: {
        ...initialValues.webhook,
        events: initialValues.webhook.events.split(",").map((e) => e.trim()),
      },
    };

    try {
      if (initialData?._id) {
        await dispatch(
          updateProvider({ id: initialData._id, data: payload })
        ).unwrap();
        toast.toast({ title: "Provider updated successfully" });
        onClose();
      } else {
        await dispatch(createProvider(payload)).unwrap();
        toast.toast({ title: "Provider created successfully" });
      }

      dispatch(fetchProviders());
    } catch (error) {
      toast.toast({ title: "Something went wrong" });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Provider Configuration</CardTitle>
          <CardDescription>
            Configure your API integration settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApTextInput
            label="Provider Name"
            name="provider"
            value={initialValues.provider}
            onChange={handleChange}
          />

          <ApTextInput
            label="API Base URL"
            name="baseUrl"
            value={initialValues.baseUrl}
            onChange={handleChange}
          />

          <ApTextInput
            label="Token"
            name="token"
            type="password"
            value={initialValues.token}
            onChange={handleChange}
          />

          <ApTextInput
            label="Public Key (Optional)"
            name="publicKey"
            type="password"
            value={initialValues.publicKey}
            onChange={handleChange}
          />

          <ApTextInput
            label="Secret Key (Optional)"
            name="secretKey"
            type="password"
            value={initialValues.secretKey}
            onChange={handleChange}
          />

          <div className="flex items-center space-x-3">
            <Switch
              checked={initialValues.testMode}
              onCheckedChange={(val) =>
                setInitialValues((prev) => ({ ...prev, testMode: val }))
              }
            />
            <Label>Test Mode</Label>
            {initialValues.testMode && (
              <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">
                Test
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              checked={initialValues.enabled}
              onCheckedChange={(val) =>
                setInitialValues((prev) => ({ ...prev, enabled: val }))
              }
            />
            <Label>Enabled</Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              checked={initialValues.autoWalletFunding}
              onCheckedChange={(val) =>
                setInitialValues((prev) => ({
                  ...prev,
                  autoWalletFunding: val,
                }))
              }
            />
            <Label>Auto Wallet Funding</Label>
          </div>
        </CardContent>
      </Card>

      {/* Webhook Section */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Settings</CardTitle>
          <CardDescription>
            Configure webhook notification behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ApTextInput
            label="Webhook URL"
            name="url"
            value={initialValues.webhook.url}
            onChange={(e) => handleChange(e, true)}
          />

          <ApTextInput
            label="Webhook Secret"
            name="secret"
            type="password"
            value={initialValues.webhook.secret}
            onChange={(e) => handleChange(e, true)}
          />

          <ApTextInput
            label="Webhook Events"
            name="events"
            type="textarea"
            value={initialValues.webhook.events}
            onChange={(e) => handleChange(e, true)}
          />

          <div className="flex items-center space-x-3">
            <Switch
              checked={initialValues.webhook.enabled}
              onCheckedChange={(val) =>
                setInitialValues((prev) => ({
                  ...prev,
                  webhook: {
                    ...prev.webhook,
                    enabled: val,
                  },
                }))
              }
            />
            <Label>Enable Webhook</Label>
          </div>
        </CardContent>
      </Card>

      <div className="text-right">
        <ApButton
          loading={loading}
          defaultText={initialData ? "Update Provider" : "Create Provider"}
          icon={<Save className="w-4 h-4 mr-2" />}
        />
      </div>
    </form>
  );
}

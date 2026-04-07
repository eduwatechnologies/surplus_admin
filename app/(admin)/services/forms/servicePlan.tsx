"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  addServicePlan,
  updateServicePlan,
} from "@/lib/redux/slices/service/serviceThunk";
import { ServicePlan } from "@/lib/redux/slices/service/type";

interface ServicePlanFormProps {
  subServiceId: string;
  serviceType?: string;
  subCode?: string;
  provider?: string;
  initialValues?: Partial<ServicePlan>;
  onSubmitSuccess?: () => void;
}

const servicePlanSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  serviceType: Yup.string().required("Service type is required"),
  network: Yup.string().required("Network is required"),
  planKind: Yup.string().oneOf(["fixed", "variable"]).required("Plan kind is required"),
  category: Yup.string().required("Category is required"),
  autopilotId: Yup.string().trim().notRequired(),
  validity: Yup.string().when("planKind", {
    is: "fixed",
    then: (s) => s.required("Validity is required"),
    otherwise: (s) => s.notRequired(),
  }),
  ourPrice: Yup.number()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) {
        return undefined;
      }
      return value;
    })
    .when("planKind", {
      is: "fixed",
      then: (s) => s.required("Price is required"),
      otherwise: (s) => s.notRequired(),
    }),
  active: Yup.boolean(),
});

function normalizeServiceType(input?: string) {
  const raw = String(input || "").trim().toLowerCase();
  if (raw === "cabletv" || raw === "cable_tv" || raw === "cable-tv") return "cable";
  if (raw === "exampin" || raw === "exam_pin" || raw === "exam-pin") return "exam";
  return raw;
}

const NETWORK_CODE_BY_KEY: Record<string, string> = {
  mtn: "01",
  airtel: "02",
  "9mobile": "03",
  glo: "04",
  gotv: "01",
  dstv: "02",
  startime: "03",
  showmax: "06",
  ikejaelectric: "01",
  ekoelectric: "02",
  abujaelectric: "03",
  waec: "01",
  neco: "02",
  nabteb: "03",
};

function normalizeNetworkKeyFromSubCode(subCode?: string) {
  const raw = String(subCode || "").trim().toLowerCase();
  if (!raw) return "";
  if (raw.endsWith("-data") || raw.endsWith("-airtime")) {
    const prefix = raw.split("-")[0];
    if (prefix === "9mobile") return "9mobile";
    return prefix;
  }
  if (raw === "ikeja-electric") return "ikejaelectric";
  if (raw === "eko-electric") return "ekoelectric";
  if (raw === "abuja-electric") return "abujaelectric";
  if (raw === "startimes") return "startime";
  return raw;
}

export function ServicePlanForm({
  subServiceId,
  serviceType,
  subCode,
  provider,
  initialValues = {
    name: "",
    ourPrice: "",
    validity: "",
    category: "",
    serviceType: "",
    network: "",
    autopilotId: "",
    easyaccessId: "",
    planKind: "fixed",
    active: true,
  },
  onSubmitSuccess,
}: ServicePlanFormProps) {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const normalizedService = normalizeServiceType(
    serviceType || (initialValues as any).serviceType || (initialValues as any).type
  );
  const defaultPlanKind = normalizedService === "electricity" ? "variable" : "fixed";
  const networkKey = normalizeNetworkKeyFromSubCode(subCode);
  const derivedNetwork = NETWORK_CODE_BY_KEY[networkKey] || "";
  const effectiveInitialValues: any = {
    ...initialValues,
    ourPrice:
      typeof (initialValues as any).ourPrice === "number" ? (initialValues as any).ourPrice : "",
    serviceType: normalizedService || (initialValues as any).serviceType || "",
    planKind: (initialValues as any).planKind || defaultPlanKind,
    network: (initialValues as any).network || derivedNetwork || "",
    category:
      (initialValues as any).category ||
      (normalizedService === "data" ? "SME" : "VTU"),
    validity:
      (initialValues as any).validity ||
      (defaultPlanKind === "variable" ? "Instant" : "30 Days"),
    active: (initialValues as any).active ?? true,
  };

  const showEasyaccessId = String(provider || "").toLowerCase() === "easyaccess";
  const showAutopilotId = String(provider || "").toLowerCase().includes("autopilot");

  return (
    <Formik
      initialValues={effectiveInitialValues}
      validationSchema={servicePlanSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const normalized = normalizeServiceType(values.serviceType);
          const body: any = {
            name: String(values.name || "").trim(),
            category: String(values.category || "").trim(),
            validity: String(values.validity || "").trim(),
            serviceType: normalized,
            network: String(values.network || "").trim(),
            planKind: values.planKind || defaultPlanKind,
            active: values.active ?? true,
          };

          if (body.planKind !== "variable") {
            body.ourPrice = Number(values.ourPrice);
          }
          if (showEasyaccessId && values.easyaccessId) body.easyaccessId = String(values.easyaccessId).trim();
          if (values.autopilotId) body.autopilotId = String(values.autopilotId).trim();

          if (!values._id) {
            await dispatch(
              addServicePlan({
                subServiceId: subServiceId,
                payload: body,
              })
            );
          } else {
            await dispatch(
              updateServicePlan({
                id: values._id,
                data: body,
              })
            );
          }

          setSubmitting(false);
          onSubmitSuccess?.();
        } catch (err) {
          toast.toast({
            title: "Failed",
            description: "Could not save plan. Check required fields and try again.",
            variant: "destructive",
          });
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-6">
          <Field type="hidden" name="serviceType" />
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Plan Name
            </label>
            <Field as={Input} name="name" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-xs text-red-500 mt-1"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <Field
                as={Input}
                type="number"
                name="ourPrice"
                disabled={values.planKind === "variable"}
              />
              <ErrorMessage
                name="ourPrice"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Validity
              </label>
              <Field
                as={Input}
                name="validity"
                disabled={values.planKind === "variable"}
              />
              <ErrorMessage
                name="validity"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Field as={Input} name="category" />
              <ErrorMessage
                name="category"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <Input value={values.serviceType || ""} disabled />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Network
              </label>
              <Field
                as="select"
                name="network"
                disabled={!!derivedNetwork}
                className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Network</option>
                {normalizeServiceType(values.serviceType) === "data" ||
                normalizeServiceType(values.serviceType) === "airtime" ? (
                  <>
                    <option value="01">MTN</option>
                    <option value="02">Airtel</option>
                    <option value="03">9Mobile</option>
                    <option value="04">Glo</option>
                  </>
                ) : normalizeServiceType(values.serviceType) === "cable" ? (
                  <>
                    <option value="01">GOtv</option>
                    <option value="02">DStv</option>
                    <option value="03">Startimes</option>
                    <option value="06">Showmax</option>
                  </>
                ) : normalizeServiceType(values.serviceType) === "electricity" ? (
                  <>
                    <option value="01">Ikeja Electric</option>
                    <option value="02">Eko Electric</option>
                    <option value="03">Abuja Electric</option>
                  </>
                ) : normalizeServiceType(values.serviceType) === "exam" ? (
                  <>
                    <option value="01">WAEC</option>
                    <option value="02">NECO</option>
                    <option value="03">NABTEB</option>
                  </>
                ) : null}
              </Field>
              <ErrorMessage
                name="network"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Plan Kind
              </label>
              <Field
                as="select"
                name="planKind"
                className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
              </Field>
              <ErrorMessage
                name="planKind"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {showEasyaccessId ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  EasyAccess Plan Id
                </label>
                <Field as={Input} name="easyaccessId" />
                <ErrorMessage
                  name="easyaccessId"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
            ) : null}

            {showAutopilotId ? (
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Autopilot Plan Id
                </label>
                <Field as={Input} name="autopilotId" />
                <ErrorMessage
                  name="autopilotId"
                  component="div"
                  className="text-xs text-red-500 mt-1"
                />
              </div>
            ) : null}
          </div>

          <div className="flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
            <div className="space-y-0.5">
              <span className="block text-sm font-medium text-gray-700">
                Active
              </span>
              <span className="block text-xs text-gray-500">
                Toggle to enable or disable this plan
              </span>
            </div>
            <Switch
              checked={values.active}
              onCheckedChange={(checked) => setFieldValue("active", checked)}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {values._id ? "Update Plan" : "Create Plan"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

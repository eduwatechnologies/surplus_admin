"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  addServicePlan,
  updateServicePlan,
} from "@/lib/redux/slices/service/serviceThunk";
import { ServicePlan } from "@/lib/redux/slices/service/type";

interface ServicePlanFormProps {
  subServiceId: string;
  initialValues?: Partial<ServicePlan>;
  onSubmitSuccess?: () => void;
}

const servicePlanSchema = Yup.object().shape({
  name: Yup.string().required("Plan name is required"),
  ourPrice: Yup.number().required("Price is required"),
  serviceType: Yup.string().required("ServiceType is required"),
  network: Yup.string().required("network is required"),
  validity: Yup.string().required("Validity is required"),
  category: Yup.string().required("Category is required"),
  active: Yup.boolean(),
});

export function ServicePlanForm({
  subServiceId,
  initialValues = {
    name: "",
    ourPrice: 0,
    validity: "",
    category: "",
    serviceType: "",
    network: "",
    autopilotId: "",
    easyaccessId: "",
    remitaId: "",

    active: true,
  },
  onSubmitSuccess,
}: ServicePlanFormProps) {
  const dispatch = useAppDispatch();
  console.log(subServiceId, "the id");

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={servicePlanSchema}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            // CREATE
            await dispatch(
              addServicePlan({
                subServiceId: subServiceId,
                payload: {
                  name: values.name!,
                  ourPrice: values.ourPrice!,
                  validity: values.validity!,
                  category: values.category!,
                  serviceType: values.serviceType || "",
                  network: values.network || "",
                  autopilotId: values.autopilotId || "",
                  easyaccessId: values.easyaccessId || "",
                  remitaId: values.remitaId || "",

                  active: values.active ?? true,
                },
              })
            );
          } else {
            // UPDATE
            await dispatch(
              updateServicePlan({
                id: values._id,
                data: {
                  name: values.name,
                  ourPrice: values.ourPrice,
                  validity: values.validity,
                  category: values.category,
                  network: values.network,
                  autopilotId: values.autopilotId,
                  easyaccessId: values.easyaccessId,
                  remitaId: values.remitaId,
                  active: values.active,
                },
              })
            );
          }

          setSubmitting(false);
          onSubmitSuccess?.();
        } catch (err) {
          console.error("Failed to submit plan:", err);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-6">
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
              <Field as={Input} type="number" name="ourPrice" />
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
              <Field as={Input} name="validity" />
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
              <Field
                as="select"
                name="serviceType"
                className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="data">Data</option>
                <option value="airtime">Airtime</option>
                <option value="cable">Cable TV</option>
                <option value="electricity">Electricity</option>
                <option value="exam_pin">Exam Pin</option>
              </Field>
              <ErrorMessage
                name="serviceType"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
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
                className="w-full rounded-md border border-gray-200 bg-white p-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Network</option>
                <option value="01">MTN</option>
                <option value="02">Airtel</option>
                <option value="03">GLO</option>
                <option value="04">9Mobile</option>
                <option value="05">DSTV</option>
                <option value="06">GOTV</option>
                <option value="07">STARTIMES</option>
                <option value="08">SHOWMAX</option>
                <option value="09">WAEC</option>
                <option value="10">NECO</option>
                <option value="11">JAMB</option>
                <option value="12">NABTAB</option>
              </Field>
              <ErrorMessage
                name="network"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                EasyaccessId
              </label>
              <Field as={Input} name="easyaccessId" />
              <ErrorMessage
                name="easyaccessId"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                AutopilotId
              </label>
              <Field as={Input} name="autopilotId" />
              <ErrorMessage
                name="autopilotId"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                RemitaId
              </label>
              <Field as={Input} name="remitaId" />
              <ErrorMessage
                name="remitaId"
                component="div"
                className="text-xs text-red-500 mt-1"
              />
            </div>
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

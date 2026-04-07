"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  addSubService,
  updateSubService,
} from "@/lib/redux/slices/service/serviceThunk";

interface SubServiceFormProps {
  serviceId: string;
  initialValues?: {
    _id?: string;
    name: string;
    code: string;
    provider: string;
    status: boolean;
  };
  onSubmitSuccess?: () => void;
}

const subServiceValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  provider: Yup.string().required("Provider is required"),
  status: Yup.boolean(),
});

export function SubServiceForm({
  serviceId,
  initialValues = {
    name: "",
    code: "",
    provider: "autopilot",
    status: true,
  },
  onSubmitSuccess,
}: SubServiceFormProps) {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={subServiceValidation}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            await dispatch(
              addSubService({
                ...values,
                serviceId,
              })
            );
          } else {
            await dispatch(
              updateSubService({
                id: values._id,
                data: {
                  name: values.name,
                  code: values.code,
                  provider: values.provider,
                  status: values.status,
                },
              })
            );
          }

          setSubmitting(false);
          onSubmitSuccess?.();
        } catch {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div>
            <label className="block font-medium">Name</label>
            <Field as={Input} name="name" />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Code</label>
            <Field as={Input} name="code" />
            <ErrorMessage
              name="code"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Provider</label>
            <Select
              value={values.provider}
              onValueChange={(v) => setFieldValue("provider", v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="autopilot">autopilot</SelectItem>
                <SelectItem value="easyaccess">easyaccess</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={values.status}
              onCheckedChange={(v) => setFieldValue("status", v)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {values._id ? "Update SubService" : "Create SubService"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/lib/redux/hooks";
import {
  createCategoryProvider,
  updateCategoryProvider,
} from "@/lib/redux/slices/categoryProviderSlice";

interface CategoryProviderFormProps {
  subServiceId: string;
  network: string;
  initialValues?: {
    _id?: string;
    subServiceId?: string;
    network?: string;
    category: string;
    provider: string;
    status: boolean;
  };
  onSubmitSuccess?: () => void;
}

const categoryProviderValidation = Yup.object().shape({
  category: Yup.string().required("Category is required"),
  provider: Yup.string()
    .oneOf(["easyaccess", "autopilot"], "Invalid provider")
    .required("Provider is required"),
  status: Yup.boolean(),
});

export function CategoryProviderForm({
  subServiceId,
  network,
  initialValues = {
    subServiceId: "",
    network: "",
    category: "",
    provider: "",
    status: true,
  },
  onSubmitSuccess,
}: CategoryProviderFormProps) {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={categoryProviderValidation}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            await dispatch(
              createCategoryProvider({
                ...values,
                subServiceId,
                network,
              })
            );
          } else {
            await dispatch(
              updateCategoryProvider({
                id: values._id,
                provider: values.provider,
                status: values.status,
              } as any)
            );
          }
          setSubmitting(false);
          onSubmitSuccess?.();
        } catch (err) {
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, values, setFieldValue }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium">Network</label>
              <Input value={network?.toUpperCase?.() || network} disabled />
            </div>
            <div>
              <label className="block font-medium">Subservice</label>
              <Input value={subServiceId} disabled />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium">Category</label>
            <Field as={Input} name="category" />
            <ErrorMessage
              name="category"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Provider */}
          <div>
            <label className="block font-medium">Provider</label>
            <Select
              onValueChange={(val) => setFieldValue("provider", val)}
              value={values.provider}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easyaccess">EasyAccess</SelectItem>
                <SelectItem value="autopilot">Autopilot</SelectItem>                
              </SelectContent>
            </Select>
            <ErrorMessage
              name="provider"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Switch
              checked={values.status}
              onCheckedChange={(val) => setFieldValue("status", val)}
            />
            <span>Active</span>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting}>
            {values._id
              ? "Update Category Provider"
              : "Create Category Provider"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

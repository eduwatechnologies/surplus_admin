"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useAppDispatch } from "@/lib/redux/hooks";
import { addService } from "@/lib/redux/slices/service/serviceThunk";

interface ServiceFormProps {
  initialValues?: {
    _id?: string;
    name: string;
    type: string;
    description?: string;
    status: boolean;
  };
  onSubmitSuccess?: () => void;
}

const serviceValidation = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  type: Yup.string()
    .oneOf(["airtime", "data", "electricity", "cabletv", "exampin"])
    .required("Type is required"),
  description: Yup.string().optional(),
  status: Yup.boolean(),
});

export function ServiceForm({
  initialValues = {
    name: "",
    type: "data",
    description: "",
    status: true,
  },
  onSubmitSuccess,
}: ServiceFormProps) {
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={serviceValidation}
      enableReinitialize
      onSubmit={async (values, { setSubmitting }) => {
        try {
          if (!values._id) {
            // New service
            await dispatch(
              addService({
                name: values.name,
                type: values.type as any,
                description: values.description,
                status: values.status,
              })
            );
          } else {
            // Update service: implement update logic here
            console.log("Updating service:", values);
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
            <label className="block font-medium">Type</label>
            <Field
              as="select"
              name="type"
              className="w-full border rounded p-2"
            >
              <option value="airtime">Airtime</option>
              <option value="data">Data</option>
              <option value="electricity">Electricity</option>
              <option value="cabletv">Cable TV</option>
              <option value="exampin">Exam Pin</option>
            </Field>
            <ErrorMessage
              name="type"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label className="block font-medium">Description</label>
            <Field as={Input} name="description" />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={values.status}
              onCheckedChange={(val) => setFieldValue("status", val)}
            />
            <span>Active</span>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {values._id ? "Update Service" : "Create Service"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}

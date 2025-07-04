"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const initialValues = {
  name: "",
  email: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("නම අවශ්‍යයි"),
  email: Yup.string().email("වැරදි Email එක").required("Email අවශ්‍යයි"),
});

export default function SimpleForm() {
  const onSubmit = (values: typeof initialValues) => {
    console.log("Form submitted", values);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Formik Field Form</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {/* Wrap with Formik context */}
        <Form className="space-y-4">
          <div>
            <label htmlFor="name">නම</label>
            <Field
              id="name"
              name="name"
              type="text"
              className="border w-full px-3 py-1"
            />
            <ErrorMessage
              name="name"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              className="border w-full px-3 py-1"
            />
            <ErrorMessage
              name="email"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            යවන්න
          </button>
        </Form>
      </Formik>
    </div>
  );
}

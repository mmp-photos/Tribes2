"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";
import { User, ReturnedUser } from "../lib/types/users";


export default function LoginPage() {

  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resStatus, setResStatus] = useState<number | null>(null);
  
  const authenticateUser = async (values: User) =>{
    console.log(values.password);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const status = res.status;
      setResStatus(status);
      if (!res.ok) {
        throw new Error(`Failed to send request. Status: ${res.status}`);
      }

      const result = await res.json();
      console.log(result.users)
      setData(result);
      console.log(data);
    } catch (err: any) {
        setError('A user with that email already exists')
    }
  };

  return (
    <main className="flex items-center justify-center md:h-screen">
      <h2>Login</h2>
        <Formik
          initialValues={{ email: "", password: "tribe23" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string().required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            authenticateUser(values).finally(() => setSubmitting(false));
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="email">Email</label>
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Field type="password" name="password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              <button type="submit" disabled={isSubmitting}>Submit</button>
            </Form>
          )}
        </Formik>
    </main>
  );
}
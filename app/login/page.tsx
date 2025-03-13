"use client";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import { useState, useEffect } from "react";
import { setCookie } from "cookies-next"; // For setting the token
import { Formik, Form, Field, ErrorMessage } from "formik";
import { User, ReturnedUser } from "../lib/types/users";
import * as Yup from "yup";

export default function LoginPage() {
  const { user, token } = useAuth();

    const [data, setData] = useState<User[] | null>(null);
    const [allUsers, setAllUsers] = useState<ReturnedUser[] | null>(null);
    const [showForm, setShowForm] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [resStatus, setResStatus] = useState<number | null>(null);

    const { setPageTitle } = useAuth(); 
  
    const handleLogin = async (email: string, password: string) => {
        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
            });
            console.log(`Success - no error!`);
    
            const data = await res.json();
    
            if (res.status === 401) {
                if (data && data.error) {
                    console.log("handleLogin: 401 error returned:", data.error);
                    setError(data.error);
                } else {
                    setError("Login failed with 401 status, but no error message received.");
                    console.error("Login failed with 401 status, but no error message received.");
                }
                setCookie("access_token", '', { path: '/', expires: new Date(0) }); // clear cookie
            } else if (data && data.token) {
                console.log("handleLogin: Login successful");
                setCookie("access_token", data.token, { path: "/" });
                window.location.reload();
            } else {
                if (data && data.error) {
                    console.error("handleLogin: Login failed (else block):", data);
                    setError(data.error);
                } else {
                    setError("Login failed, but no error message received.");
                    console.error("Login failed, but no error message received.");
                }
                setCookie("access_token", '', { path: '/', expires: new Date(0) }); // clear cookie
            }
        } catch (error) {
            console.error("handleLogin: Catch error:", error);
            setError("An unexpected error occurred.");
            setCookie("access_token", '', { path: '/', expires: new Date(0) }); // clear cookie
        }
    };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <h1>{user ? `Logged in as: ${user.email}` : "Not Logged In"}</h1>
        <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
            password: Yup.string()
            .required("Please enter a password")
            .min(8, "Password must have at least 8 characters")        
        })}
        onSubmit={(values, { setSubmitting }) => {
            handleLogin(values.email, values.password).finally(() => setSubmitting(false));
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
        {error && <p style={{ color: "red" }}>{error}</p>}
    </main>
  );
}

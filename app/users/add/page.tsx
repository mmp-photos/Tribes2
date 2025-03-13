"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";
import { User, ReturnedUser } from "../../lib/types/users";

const AddUser: React.FC = () => {
  
  const [data, setData] = useState<User[] | null>(null);
  const [allUsers, setAllUsers] = useState<ReturnedUser[] | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resStatus, setResStatus] = useState<number | null>(null);

  const { setPageTitle } = useAuth(); 

  useEffect(() => {
    setPageTitle("Add a User");
  }, [setPageTitle]);


  const testUsersAPI = async (values: User) => {
    try {
      const res = await fetch("/api/users", {
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
      console.log(res)
      setData(result);
      setShowForm(false);
      setAllUsers(result.users);
    } catch (err: any) {
        setShowForm(false);
        setError('A user with that email already exists')
    }
  };
  if(data){
    console.log(`The returned users are ${allUsers}`);
  }
  return (
    <main>
      {showForm && (
        <>
        <h2>Add User</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={Yup.object({
            email: Yup.string().email("Invalid email address").required("Required"),
          })}
          onSubmit={(values, { setSubmitting }) => {
            testUsersAPI(values).finally(() => setSubmitting(false));
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
        </>
      )}

      {resStatus &&
        <>
          <h3>An error occurred</h3>
          <p className="error">{error}</p>
        </>
      }

  {data && allUsers ? (
    allUsers.length > 0 ? (
      allUsers.map((user) => <li key={user.email}>{user.email}</li>)
    ) : (
      <p>No users available</p>
    )
  ) : null}
    </main>
  );
};

export default AddUser;

"use client";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { connectToDatabase } from "@/app/lib/databasae/connectToDatabase";

interface User {
  _id: string;
  username: string;
  dateCreate: string;
  // Add other fields if necessary
}

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("An email is required"),
  password: yup.string().required("Password is required")
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  passwordConfirmation: yup.string()
    .oneOf([yup.ref('password')], 'Passwords must match')
});

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   try {
//       const res = await fetch('/api/users', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ name: firsName, password }),
//       });

//       const data = await res.json();
//       setResponse(data);
//   } catch (error) {
//       console.error('Error sending request:', error);
//       setResponse({ error: 'Failed to send request' });
//   }
// };
const initialValues = {
  firstName: "",
  lastName: "",
  password: "",
  passwordConfirmation: ""
};

const testUsersAPI = async () => {
  try {
      const res = await fetch('/api/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
              email: "bbird@sesame.org",
              password: "password",
              accountType: "admin",
              dateCreated: new Date(Date.now()).toISOString(),
          }),
      });

      if (!res.ok) {
          throw new Error(`Failed to send request. Status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Response data:", data);
  } catch (error) {
      console.error('Error sending request:', error);
  }
};

const Database: React.FC = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>("");
  const [conected, setConnected] = useState<string | null >("");

  const values = {
    firstName: 'Big',
    lastName: 'Bird',
    email: 'bbird@sesame.org',
    password: 'test'
  };

  // const checkData = async (values: { firstName: string; lastName: string; password: string; passwordConfirmation: string }) => {

  const checkData = async (values: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const response = await fetch('/api/database', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };
  
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <main>
        {/* <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={checkData}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h3>Make a Reservation</h3>
              <div>
                <label>First Name:</label>
                <Field name="firstName" type="text" className="form-control" />
                <ErrorMessage name="firstName" component="div" className="error" />
                <label>Last Name:</label>
                <Field name="lastName" type="text" className="form-control" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>
              <div>
                <label>Password:</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              <div>
                <label>Confirm:</label>
                <Field name="passwordConfirmation" type="password" className="form-control" />
                <ErrorMessage name="passwordConfirmation" component="div" className="error" />
              </div>
              <Button type="submit">Click Me</Button>
            </Form>
          )}
        </Formik> */}

        <h2>Click me</h2>
        <Button onClick={testUsersAPI}>Test Users</Button>
      </main>
    );
  }

  return (
    <main>
      <h2>Database Result</h2>
      {data ? (
        <ul>
          {data.map((user) => (
            <li key={user._id}>{user.username}</li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
      {error && <p>Error: {error}</p>}
    </main>
  );
};

export default Database;

"use client";
import React, { useState } from "react";
import { Button } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

interface User {
  _id: string;
  username: string;
  dateCreate: string;
  // Add other fields if necessary
}

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  password: yup.string().required("Password is required"),
});

const initialValues = {
  name: "",
  password: "",
};

const Database: React.FC = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState<string | null>("");

  const checkData = async (values: { name: string; password: string }) => {
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
        <Formik
          initialValues={initialValues}
          validationSchema={schema}
          onSubmit={checkData}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <h3>Make a Reservation</h3>
              <div>
                <label>Name:</label>
                <Field name="name" type="text" className="form-control" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
              <div>
                <label>Password:</label>
                <Field name="password" type="password" className="form-control" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              <Button type="submit">Click Me</Button>
            </Form>
          )}
        </Formik>
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

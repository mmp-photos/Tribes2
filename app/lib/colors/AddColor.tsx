
"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";
import { Color } from "../types/color";

interface AllColorsProps {
    initialLoad: boolean;
    setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
    data: Color[] | null;
    setData: React.Dispatch<React.SetStateAction<Color[]>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

export const AddColor: React.FC = () => {
  const [data, setData] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resStatus, setResStatus] = useState<string | null>(null);

  const placeHolder = ()=>{
    console.log(`Click the button`)
  };

  if(data){
    console.log(`The color has been added to the database.`);
    <h2>Database Result</h2>
    {data.length > 0 ? (
      <ul>
        <li>TEST</li>
        {data.map((color) => (
          <li key={color.colorName}>
            {color.colorName}
          </li>
        ))}
      </ul>
    ) : (
      <p>No data available</p>
    )}
  }
  return (
    <>
        <h2>Add Color</h2>
        <Formik
          initialValues={{ colorName: "", colorValue: "" }}
          validationSchema={Yup.object({
              colorName: Yup.string()
                .required("Color name is required"),
              colorValue: Yup.string()
                .required("Color value is required"),
            })}
          onSubmit={(values, { setSubmitting }) => {
            placeHolder();
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div>
                <label htmlFor="colorName">Color Name</label>
                <Field type="text" name="colorName" />
                <ErrorMessage name="colorName" component="div" className="colorName" />
              </div>
              <div>
                <label htmlFor="colorValue">Color Value</label>
                <Field type="text" name="colorValue" />
                <ErrorMessage name="colorValue" component="div" className="colorValue" />
              </div>
              <button type="submit" disabled={isSubmitting}>Submit</button>
            </Form>
          )}
        </Formik>
    </>
  );
};

export default AddColor;

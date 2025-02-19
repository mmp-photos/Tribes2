"use client";
import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";
import { AllColors } from "../lib/colors/AllColors";
import { AddColor } from "../lib/colors/AddColor"
import { Color } from "../lib/types/color";

const Colors: React.FC = () => {
  const [data, setData] = useState<Color[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resStatus, setResStatus] = useState<string | null>(null);

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
    <main>
        <AllColors />
        <AddColor />
    </main>
  );
};

export default Colors;

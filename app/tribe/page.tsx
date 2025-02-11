"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { set } from "mongoose";

interface User {
  email: string;
  password: string;
}

interface ReturnedUser {
  accountStatus: string;
  accountType: string;
  createdAt: Date;
  email: string;
  password: string;
  termsAccepted: string,
  termsAcceptedOn: Date
  updatedAt: Date;
}
const Tribe: React.FC = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [allUsers, setAllUsers] = useState<ReturnedUser[] | null>(null);
  const [showForm, setShowForm] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [resStatus, setResStatus] = useState<number | null>(null);

  const testUsersAPI = async (values: User) => {
    try {
      const res = await fetch("/api/test", {
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
      <h2>Tribal Style</h2>
    </main>
  );
};

export default Tribe;

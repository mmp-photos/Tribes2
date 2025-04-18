"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import PhotoForm from "../lib/photos/PhotoForm";

const Photos: React.FC = () => {
  const { user, token } = useAuth();

  return (
    <main>
      <PhotoForm />
    </main>
  );
};

export default Photos;
"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Tribe: React.FC = () => {
  const { isAdmin, profileId } = useAuth();

  return (
    <main>
      
    </main>
  );
};

export default Tribe;

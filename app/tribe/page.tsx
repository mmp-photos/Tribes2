"use client";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext

const Tribe: React.FC = () => {
  const { user, token } = useAuth();

  return (
    <main>
      {user ? <p>Welcome, {user.email}!</p> : <p>Not Logged In</p>}
    </main>
  );
};

export default Tribe;

"use client";
import React, { useState, useEffect } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
}

const testUsersAPI = async () => {
  try {
    const res = await fetch("/api/all", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: {
          email: null
        }
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send request. Status: ${res.status}`);
    }

    const data = await res.json();
    console.log("Response data:", data);
    return data;
  } catch (error) {
    console.error("Error sending request:", error);
    throw error;
  }
};

const allUsers: React.FC = () => {
  const [data, setData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await testUsersAPI();
        setData(result);
      } catch (err: any) {
        setError(err.message || "An unknown error occurred.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return (
      <main>
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main>
      <h2>Database Result</h2>
      {data.length > 0 ? (
        <ul>
          {data.map((user) => (
            <li key={user._id}>
              {user.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data available</p>
      )}
    </main>
  );
};

export default allUsers;

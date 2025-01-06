"use client";

import React, { useEffect, useState } from 'react';

interface User {
    _id: string;
    username: string;
    dateCreate: string;
    // Add other fields if necessary
  }

const Database: React.FC = () => {
    const uri = "mongodb+srv://webBased:<db_password>@clustercore.rkcxmtz.mongodb.net/?retryWrites=true&w=majority&appName=ClusterCore";

    const [data, setData] = useState<User[] | null>(null); // State is now an array of User objects or null
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/database');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                setData(result);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
          <h1>Database Result</h1>
          {data ? (
            <ul>
              {data.map((user) => (
                <li key={user._id}>
                  <h2>{user.username}</h2>
                </li>
              ))}
            </ul>
          ) : (
            <p>No data available</p>
          )}
    
          {error && <p>Error: {error}</p>}
        </div>
      );
};
    
export default Database;

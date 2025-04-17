// ColorDetailsDisplay.tsx
"use client";
import React, { useState, useEffect } from "react";
import { People } from "../types/people";

interface PersonDetailsDisplayProps {
    personId: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const PersonDetailsDisplay: React.FC<PersonDetailsDisplayProps> = ({ personId, onEdit, onDelete }) => {
    const [person, setPerson] = useState<People | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchPersonDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/people?id=${encodeURIComponent(personId)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    console.log(res.status);
                    console.log(`Fetch failed.`);
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Failed to fetch person. Status: ${res.status}`);
                }
                const result = await res.json();
                console.log(`Result is ${result.person?.firstName}`); // Use optional chaining in case person is null/undefined
                if (result.person) { // Check if result.person exists (it's the person object)
                    setPerson(result.person);
                } else {
                    setError("Person not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching person details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (personId) {
            fetchPersonDetails();
        } else {
            setPerson(null);
            setLoading(false);
        }
    }, [personId]);

    if (loading) {
        return <p>Loading color details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!person) {
        return <p>No color details to display.</p>;
    }

    return (
        <div>
            <h2>{person.firstName} {person.lastName}</h2>
            <p>Biography: {person.biography}</p>
            <button onClick={() => onEdit(person._id.toString())}>Edit Person</button>
            <button onClick={() => onDelete(person._id.toString())}>Delete Person</button>
        </div>
    );
};

export default PersonDetailsDisplay;
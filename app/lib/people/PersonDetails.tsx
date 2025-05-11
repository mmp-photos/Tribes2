// ColorDetailsDisplay.tsx
"use client";
import React, { useState, useEffect } from "react";
import { People } from "../types/people";
import HandleNickName from "./HandleNickName";
import AdditionalPhotosList from "../photos/PeoplePhotos";
import FormatDate from '../database/FormatDate';
import { useAuth } from "../../context/AuthContext";

interface PersonDetailsDisplayProps {
    personId: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const PersonDetailsDisplay: React.FC<PersonDetailsDisplayProps> = ({ personId, onEdit, onDelete }) => {
    const [person, setPerson] = useState<People | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isAdmin } = useAuth();

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
                // console.log(`Result is ${result.person?.firstName}`);
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
            fetchPersonDetails()
        } else {
            setPerson(null);
            setLoading(false);
        }
    }, [personId]);

    if (loading) {
        return <p>Loading person details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!person) {
        return <p>No color details to display.</p>;
    }
    console.log(`Found this person in the database ${JSON.stringify(person, null, 2)}`);

    return (
        <div>
            <h2><HandleNickName person={person} /></h2>
            <p>Biography: {person.biography}</p>
            <p>DOB: {FormatDate(person.dob)}</p>
            {person.additionalPhotos && (
                <AdditionalPhotosList
                    additionalPhotos={person.additionalPhotos.map(item => (
                        item.photoId ? {
                            photoId: {
                                _id: item.photoId._id,
                                fileName: item.photoId.fileName,
                                url: item.photoId.url,
                                creditName: item.photoId.creditName,
                                creditUrl: item.photoId.creditUrl,
                                defaultCaption: item.photoId.defaultCaption,
                            },
                            caption: item.caption,
                        } : null
                    )).filter(item => item !== null)}
                />
            )}

            {isAdmin ? (
            <>
                <button onClick={() => onEdit(person._id.toString())}>Edit Person</button>
                <button onClick={() => onDelete(person._id.toString())}>Delete Person</button>
            </>
            ) : null}
        </div>
    );
};

export default PersonDetailsDisplay;
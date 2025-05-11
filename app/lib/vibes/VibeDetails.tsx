// ColorDetailsDisplay.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Vibes } from "../types/vibes";
import AdditionalPhotosList from "../photos/PeoplePhotos";
import FormatDate from '../database/FormatDate';
import { useAuth } from "../../context/AuthContext";

interface VibeDisplayProps {
    vibeId: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

const VibeDetailsDisplay: React.FC<VibeDisplayProps> = ({ vibeId, onEdit, onDelete }) => {
    const [vibes, setVibes] = useState<Vibes | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchVibeDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/vibes?id=${encodeURIComponent(vibeId)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    console.log(res.status);
                    console.log(`Fetch failed.`);
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Failed to fetch vibe. Status: ${res.status}`);
                }

                const result = await res.json();
                console.log(`Result is ${result.vibe?.vibes}`);
                if (result.vibe) { // Check if result.vibe exists (it's the vibe object)
                    setVibes(result.vibe);
                    console.log(result.vibe);
                } else {
                    setError("Vibe not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching vibe details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (vibeId) {
            fetchVibeDetails()
        } else {
            setVibes(null);
            setLoading(false);
        }
    }, [vibeId]);

    if (loading) {
        return <p>Loading vibe details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!vibes) {
        return <p>No color details to display.</p>;
    }
    console.log(`Found this vibe in the database ${JSON.stringify(vibes, null, 2)}`);

    return (
        <div>
            <h2>{vibes.vibe}</h2>
            <article>{vibes.description}</article>

            {vibes?._id && isAdmin ? (
            <>
                <button onClick={() => onEdit(vibes._id.toString())}>Edit Vibe</button>
                <button onClick={() => onDelete(vibes._id.toString())}>Delete Vibe</button>
            </>
            ) : null}
        </div>
    );
};

export default VibeDetailsDisplay;
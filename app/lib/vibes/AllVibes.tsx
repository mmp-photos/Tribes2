"use client";
import React, { useState, useEffect } from "react";
import { Vibes, VibeId } from "../types/vibes";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";

interface AllVibesProps {
    onAddNewClick: () => void;
}

const AllVibes: React.FC<AllVibesProps> = ({ onAddNewClick }) => {
    const [data, setData] = useState<Vibes[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isAdmin } = useAuth();

    const findVibe: VibeId[] = [];
    const queryString = findVibe.map((vibe) => `ids=${encodeURIComponent(vibe.toString())}`).join("&");
    
    const getAllVibes = async (findVibe: VibeId[]) => {
        try {
            const res = await fetch(`/api/vibes?${queryString}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            console.log(data);
            setData(result.vibe || []);
        } catch (err: any) {
            setError("There was an error fetching the colors.");
        }
    };

    useEffect(() => {
        getAllVibes(findVibe);
    }, []);

    return (
        <>
            <h2>All Vibes</h2>
            {data ? (
                <ul id="allVibes">

                    {data.map((vibe) => (
                        <li
                        key={vibe._id?.toString()}
                        ><a href={`/vibes?id=${vibe._id?.toString()}`}>{vibe.vibe}</a></li>
                    ))}
                    {isAdmin && <button onClick={onAddNewClick}>Add Vibe</button>}
                </ul>
            ) : (
                <p>Loading vibes...</p>
            )}
        </>
    );
};

export default AllVibes;
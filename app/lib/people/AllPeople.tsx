"use client";
import React, { useState, useEffect } from "react";
import { People, PersonId } from "../types/people";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";

interface AllColorsProps {
    onAddNewClick: () => void;
}

const AllPeople: React.FC<AllColorsProps> = ({ onAddNewClick }) => {
    const [data, setData] = useState<People[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isAdmin } = useAuth();

    const findPeople: PersonId[] = [];
    const queryString = findPeople.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&");


    const getAllPeople = async (findPeople: PersonId[]) => {
        try {
            const res = await fetch(`/api/people?${queryString}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            console.log(data);
            setData(result.person || []);
        } catch (err: any) {
            setError("There was an error fetching the colors.");
        }
    };

    useEffect(() => {
        getAllPeople(findPeople);
    }, []);

    return (
        <>
            <h2>All People</h2>
            {data ? (
                <ul id="allPeople">

                    {data.map((person) => (
                        <li
                        key={person._id?.toString()}
                        ><a href={`/people?id=${person._id?.toString()}`}>{person.firstName} {person.lastName}</a></li>
                    ))}
                    {isAdmin && <button onClick={onAddNewClick}>Add Person</button>}
                </ul>
            ) : (
                <p>Loading people...</p>
            )}
        </>
    );
};

export default AllPeople;

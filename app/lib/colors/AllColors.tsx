"use client";
import React, { useState, useEffect } from "react";
import { Color, ColorId } from "../types/color";
import { useRouter } from 'next/navigation';
import { useAuth } from "../../context/AuthContext";

const AllColors: React.FC = () => { // Use the interface
    const [data, setData] = useState<Color[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { isAdmin } = useAuth();

    const findColors: ColorId[] = [];
    const queryString = findColors.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&");


    const getAllColors = async (findColors: ColorId[]) => {
        try {
            const res = await fetch(`/api/colors?${queryString}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            setData(result.colors || []);
        } catch (err: any) {
            setError("There was an error fetching the colors.");
        }
    };



    const colorMouseOver = (e: React.MouseEvent<HTMLLIElement>) => {
        e.currentTarget.classList.add("hovered");
    };

    const colorMouseOut = (e: React.MouseEvent<HTMLLIElement>) => {
        e.currentTarget.classList.remove("hovered");
    };



    useEffect(() => {
        getAllColors(findColors);
    }, []);



    return (
        <>
            <h2>All Colors</h2>
            {data ? (
                <ul className="colors show" id="allColors">
                    {isAdmin && <li className="color-swatch" style={{backgroundColor: "blue"}}>+</li>}
                    {data.map((color) => (
                        <li
                            className="color-swatch"
                            onMouseOver={colorMouseOver}
                            onMouseOut={colorMouseOut}
                            onClick={() => router.push(`/colors?id=${color._id.toString()}`)}
                            key={color._id?.toString()}
                            style={{ backgroundColor: `#${color.colorValue}` }}
                        ></li>
                    ))}
                </ul>
            ) : (
                <p>Loading colors...</p>
            )}
        </>
    );
};

export default AllColors;

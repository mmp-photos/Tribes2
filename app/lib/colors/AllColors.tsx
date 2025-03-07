"use client"
import React, { useState, useEffect } from "react";
import { Color, ColorId } from "../types/color";

const AllColors: React.FC = () => {

    const [data, setData] = useState<Color[]>([]);
    const [colorDetails, setColorDetails] = useState<Color[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [resStatus, setResStatus] = useState<string | null>(null);

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

    const editColor = async (colorId: string) => {
        try{
            const res = await fetch(`/api/test?ids=${encodeURIComponent(colorId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            setColorDetails(result.colors || []);
        }
        catch (err: any) {
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
                    <li className="color-swatch" style={{ backgroundColor: "var(--background-primary)" }}>+</li>
                    {data.map((color) => (
                        <li
                            className="color-swatch"
                            onMouseOver={colorMouseOver}
                            onMouseOut={colorMouseOut}
                            onClick={() => editColor(color._id.toString())}  // ✅ Convert to string
                            key={color._id.toString()}  // ✅ Fix: Use unique key
                            style={{ backgroundColor: `#${color.colorValue}` }}>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Loading colors...</p>
            )}
            {colorDetails ? (
                <ul className="color-details">
                    {colorDetails.map((color) => (
                        <li key={color._id.toString()}><h2 style={{color: `#${color.colorValue}`}}>{color.colorName}</h2><br/>
                        {color.colorValue}
                        </li>
                    ))}
                </ul>
            ) : 
                null
            }
        </>
)};

export default AllColors
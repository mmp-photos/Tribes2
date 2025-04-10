// ColorDetailsDisplay.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Color } from "../types/color";
import { ObjectId } from "mongoose"; // Import ObjectId type if needed
import RelatedColors from "./RelatedColors";

interface ColorDetailsDisplayProps {
    colorId: string;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

interface RelatedColor {
    _id: string;
    colorName: string;
    colorValue: string;
}

const ColorDetailsDisplay: React.FC<ColorDetailsDisplayProps> = ({ colorId, onEdit, onDelete }) => {
    const [color, setColor] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchColorDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/colors?id=${encodeURIComponent(colorId)}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || `Failed to fetch color. Status: ${res.status}`);
                }
                const result = await res.json();
                if (result.colors && result.colors.length > 0) {
                    setColor(result.colors[0]);
                } else {
                    setError("Color not found.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred while fetching color details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (colorId) {
            fetchColorDetails();
        } else {
            setColor(null);
            setLoading(false);
        }
    }, [colorId]);

    if (loading) {
        return <p>Loading color details...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!color) {
        return <p>No color details to display.</p>;
    }

    return (
        <div>
            <h2>{color.colorName}</h2>
            <p>Value: {color.colorValue}</p>
            <p>Description: {color.colorDescription}</p>
            {color.complementaryColors && color.complementaryColors.length > 0 && (
                <RelatedColors colors={color.complementaryColors} title="Complementary Colors" />
            )}

            {color.contrastingColors && color.contrastingColors.length > 0 && (
                <RelatedColors colors={color.contrastingColors} title="Contrasting Colors" />
            )}                
            <button onClick={() => onEdit(color._id.toString())}>Edit Color</button>
            <button onClick={() => onDelete(color._id.toString())}>Delete Color</button>
        </div>
    );
};

export default ColorDetailsDisplay;
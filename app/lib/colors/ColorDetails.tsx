import React, { useState, useEffect } from "react";
import { Color, RelatedColor } from "../types/color";
import MDEditor from "@uiw/react-md-editor";
import RelatedColors from "./RelatedColors";
import mongoose from 'mongoose';
import { useAuth } from "../../context/AuthContext";

interface ColorDetailsDisplayProps {
    colorId: string;
}

const ColorDetailsDisplay: React.FC<ColorDetailsDisplayProps> = ({ colorId }) => {
    const [color, setColor] = useState<Color | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { isAdmin } = useAuth();

    useEffect(() => {
        const fetchColorDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                // Basic validation of the colorId.
                if (!colorId || !mongoose.Types.ObjectId.isValid(colorId)) {
                    setError("Invalid color ID.");
                    setLoading(false);
                    return;
                }

                const res = await fetch(`/api/colors?id=${encodeURIComponent(colorId)}`);

                if (!res.ok) {
                    setError(`Failed to fetch color details. Status: ${res.status}`);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                if (data.colors && data.colors.length > 0) {
                    setColor(data.colors[0]); //  data.colors is an array
                }
                else {
                    setError("Color not found");
                    setLoading(false);
                    return;
                }

            } catch (err: any) {
                setError(err.message || "An error occurred while fetching color details.");
            } finally {
                setLoading(false);
            }
        };

        fetchColorDetails();
    }, [colorId]);

    if (loading) {
        return <div>Loading color details...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!color) {
        return <div>No color details to display.</div>;
    }

    // Helper function to ensure we only pass Color objects to RelatedColors
    const getRelatedColorsArray = (colors: any[] | undefined): Color[] => {
        if (!colors) return [];
        return colors.filter((c): c is Color =>
            typeof c === 'object' &&
            c !== null &&
            'colorName' in c &&  // Check for colorName
            'colorValue' in c    // and colorValue properties
        );
    };

    return (
        <div className="color-details">
            <h3 style={{ color: `#${color.colorValue}` }}>{color.colorName}</h3>
            <p>Color Value: #{color.colorValue}</p>
            <div>
                <h4>Description:</h4>
                <MDEditor.Markdown source={color.colorDescription} />
            </div>
            {color && color.complementaryColors && color.complementaryColors.length > 0 && (
                <RelatedColors colors={getRelatedColorsArray(color.complementaryColors)} title="Complementary Colors" />
            )}
            {color && color.contrastingColors && color.contrastingColors.length > 0 && (
                <RelatedColors colors={getRelatedColorsArray(color.contrastingColors)} title="Contrasting Colors" />
            )}
            {isAdmin ? (
                <button>Edit Color</button>
            ) : (
                null
            )}
        </div>

    );
};

export default ColorDetailsDisplay;

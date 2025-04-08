"use client";
import React, { useState, useEffect } from "react";
import { Color, ColorId } from "../lib/types/color";
import { useAuth } from "../context/AuthContext";
import AllColors from "../lib/colors/AllColors";
import ColorDetailsDisplay from "../lib/colors/ColorDetails";
import EditColors from "../lib/colors/EditColors";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

const Colors = () => {
    const [colorId, setColorId] = useState<string | null>(null);
    const [editColor, setEditColor] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // State for adding new
    const { setPageTitle, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setPageTitle("Colors");
    }, [setPageTitle]);

    useEffect(() => {
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const idFromQuery = searchParams.get('id');

        console.log("lastSegment:", lastSegment, typeof lastSegment);
        console.log("idFromQuery:", idFromQuery, typeof idFromQuery);

        if (lastSegment && lastSegment !== 'colors' && !isAddingNew) {
            setColorId(lastSegment);
            setEditColor(false);
        } else if (idFromQuery && !isAddingNew) {
            setColorId(idFromQuery);
            setEditColor(false);
        } else if (!isAddingNew) {
            setColorId(null);
            setEditColor(false);
        }
        // isAddingNew state will control when the colorId is null for the AddNew form
    }, [pathname, searchParams, isAddingNew]);

    const handleColorUpdate = (updatedColor: Color) => {
        console.log('Color updated in Colors component:', updatedColor);
        setColorId(null);
        setEditColor(false);
        setIsAddingNew(false); // Ensure this is also reset
        router.push('/colors');
    };

    const handleColorAdded = (newColor: Color) => {
        console.log('Color added in Colors component:', newColor);
        setColorId(newColor._id.toString()); // Optionally navigate to the new color's details or edit page
        setEditColor(false); // Reset edit mode after adding
        setIsAddingNew(false);
        router.push(`/colors?id=${newColor._id}`); // Navigate to the new color's page
    };

    const onEdit = (id: string) => {
        console.log('Edit button clicked for color ID:', id);
        setColorId(id);
        setEditColor(true);
        setIsAddingNew(false); // Ensure we are not in adding new mode
    };

    const handleAddNewClick = () => {
        setIsAddingNew(true);
        setColorId(null); // Set colorId to null for the blank form
        setEditColor(true); // Show the edit component with a blank form
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setColorId(null);
        setEditColor(false);
    };

    return (
        <main>
            {isAddingNew && isAdmin ? (
                <EditColors
                    colorId={null} // Pass null to indicate adding new
                    onColorUpdate={handleColorUpdate}
                    onColorAdded={handleColorAdded}
                    // onClose={handleCancelAdd} // You might want a cancel button in EditColors
                />
            ) : colorId && editColor && isAdmin ? (
                <EditColors
                    colorId={colorId}
                    onColorUpdate={handleColorUpdate}
                    // onClose={() => {
                    //     setColorId(null);
                    //     setEditColor(false);
                    // }}
                />
            ) : colorId ? (
                <ColorDetailsDisplay
                    colorId={colorId}
                    onEdit={onEdit}
                />
            ) : (
                <AllColors onAddNewClick={handleAddNewClick} /* onEditClick should NOT be here */ />
            )}
        </main>
    );
};

export default Colors;
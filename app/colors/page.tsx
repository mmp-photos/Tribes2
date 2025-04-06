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
    const { setPageTitle, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setPageTitle("She comes in colors");
    }, []);

    useEffect(() => {
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
         const idFromQuery = searchParams.get('id');

        if (lastSegment && lastSegment !== 'colors') {
            setColorId(lastSegment);
        } else if (idFromQuery) {
            setColorId(idFromQuery);
        }
        else {
            setColorId(null);
        }
    }, [pathname, searchParams]);

    const handleColorUpdate = (updatedColor: Color) => {
        console.log('Color updated in Colors component:', updatedColor);
        setColorId(null);
        setEditColor(false);
        router.push('/colors');
    };

    // Define onEdit within useEffect
    useEffect(() => {
        const onEdit = (id: string) => {
            console.log('Edit button clicked for color ID:', id);
            setColorId(id);
            setEditColor(true);
        };
    }, [editColor]);

    const onEdit = (id: string) => {
            console.log('Edit button clicked for color ID:', id);
            setColorId(id);
            setEditColor(true);
        };

    return (
        <main>
            {colorId && editColor && isAdmin ? (
                <EditColors
                    colorId={colorId}
                    // onClose={() => {
                    //     setColorId(null);
                    //     setEditColor(false);
                    // }}
                    onColorUpdate={handleColorUpdate}
                />
            ) : colorId ? (
                <ColorDetailsDisplay 
                    colorId={colorId}
                    onEdit={() => setEditColor(true)}
                />
            ) : (
                <AllColors />
            )}
        </main>
    );
};

export default Colors;

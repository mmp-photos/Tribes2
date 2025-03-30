"use client";
import React, { useState, useEffect } from "react";
import { Color, ColorId } from "../lib/types/color";
import { useAuth } from "../context/AuthContext";
import AllColors from "../lib/colors/AllColors";
import ColorDetailsDisplay from "../lib/colors/ColorDetails";
import {  usePathname, useSearchParams } from 'next/navigation';

const Colors = () => {
    const [colorId, setColorId] = useState<string | null>(null);
    const { setPageTitle } = useAuth();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        setPageTitle("She comes in colors");
    }, []);

     useEffect(() => {
        // Get the color ID from the URL
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const idFromQuery = searchParams.get('id');

        if (lastSegment && lastSegment !== 'colors') {
            setColorId(lastSegment);
        } else if (idFromQuery) {
            setColorId(idFromQuery);
        } else {
            setColorId(null);
        }
    }, [pathname, searchParams]);

    return (
        <main>
            {colorId ? (
                <ColorDetailsDisplay colorId={colorId} />
            ) : (
                <AllColors />
            )}
        </main>
    );
};

export default Colors;

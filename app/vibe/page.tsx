// Colors.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Vibes } from "../lib/types/vibes";
import EditVibe from "../lib/vibes/EditVibes";
import VibeDetailsDisplay from "../lib/vibes/VibeDetails";
import AllVibes from "../lib/vibes/AllVibes";

const Vibe = () => {
    const [vibeId, setVibeId] = useState<string | null>(null);
    const [editVibe, setEditVibe] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // State for adding new
    const { setPageTitle, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        setPageTitle("Vibes");
    }, [setPageTitle]);

    useEffect(() => {
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const idFromQuery = searchParams.get('id');

        console.log("lastSegment:", lastSegment, typeof lastSegment);
        console.log("idFromQuery:", idFromQuery, typeof idFromQuery);

        if (lastSegment && lastSegment !== 'vibes' && !isAddingNew) {
            setVibeId(lastSegment);
            setEditVibe(false);
        } else if (idFromQuery && !isAddingNew) {
            setVibeId(idFromQuery);
            setEditVibe(false);
        } else if (!isAddingNew) {
            setVibeId(null);
            setEditVibe(false);
        }
        // isAddingNew state will control when the colorId is null for the AddNew form
    }, [pathname, searchParams, isAddingNew]);

    const handleVibeUpdate = (updatedVibe: Vibes) => {
        console.log('Vibe updated in Vibe component:', updatedVibe);
        setVibeId(null);
        setEditVibe(false);
        setIsAddingNew(false); // Ensure this is also reset
        router.push('/vibes');
    };

    const handleVibeAdded = (newVibe: Vibes) => {
        console.log('Color added in Colors component:', newVibe);
        setVibeId(newVibe._id.toString()); // Optionally navigate to the new color's details or edit page
        setEditVibe(false); // Reset edit mode after adding
        setIsAddingNew(false);
        router.push(`/vibes?id=${newVibe._id}`); // Navigate to the new color's page
    };

    const onEdit = (id: string) => {
        console.log('Edit button clicked for vibe ID:', id);
        setVibeId(id);
        setEditVibe(true);
        setIsAddingNew(false); // Ensure we are not in adding new mode
    };

    const handleDeletePerson = async (id: string) => {
        if (!isAdmin) {
            setDeleteError("You do not have permission to delete person.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this person?")) {
            return;
        }
        try {
            const res = await fetch(`/api/vibes?id=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                const errorData = await res.json(); // Assuming the error response is also JSON
                throw new Error(errorData.message || `Failed to delete color. Status: ${res.status}`);
            }
            console.log(`Color with ID ${id} deleted successfully.`);
            setVibeId(null); // Clear the selected color ID
            router.push('/vibes'); // Redirect to the main colors list
        } catch (err: any) {
            setDeleteError(err.message || "An error occurred while deleting the color.");
            console.error(err);
        }
    };

    const handleAddNewClick = () => {
        setIsAddingNew(true);
        setVibeId(null); // Set colorId to null for the blank form
        setEditVibe(true); // Show the edit component with a blank form
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setVibeId(null);
        setEditVibe(false);
    };

    return (
        <main>
            {deleteError && <p className="error-message">{deleteError}</p>}
            {isAddingNew && isAdmin ? (
                <EditVibe
                    vibeId={null} // Pass null to indicate adding new
                    onVibeUpdate={handleVibeUpdate}
                    onVibeAdded={handleVibeAdded}
                    // onClose={handleCancelAdd} // You might want a cancel button in EditColors
                />
            ) : vibeId && editVibe && isAdmin ? (
                <EditVibe
                    vibeId={vibeId}
                    onVibeUpdate={handleVibeUpdate}
                />
            ) : vibeId ? (
                <VibeDetailsDisplay
                    vibeId={vibeId}
                    onEdit={onEdit}
                    onDelete={handleDeletePerson} // Now handleDeleteColor is defined before being used
                />
            ) : (
                <AllVibes onAddNewClick={handleAddNewClick} /* onEditClick should NOT be here */ />
            )}
        </main>
    );
};

export default Vibe;
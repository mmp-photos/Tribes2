// Colors.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { People } from "../lib/types/people";
import EditPerson from "../lib/people/EditPerson";
import PersonDetailsDisplay from "../lib/people/PersonDetails";
import AllPeople from "../lib/people/AllPeople";

const Person = () => {
    const [peopleId, setPeopleId] = useState<string | null>(null);
    const [editPeople, setEditPeople] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // State for adding new
    const { setPageTitle, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        setPageTitle("People");
    }, [setPageTitle]);

    useEffect(() => {
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        const idFromQuery = searchParams.get('id');

        console.log("lastSegment:", lastSegment, typeof lastSegment);
        console.log("idFromQuery:", idFromQuery, typeof idFromQuery);

        if (lastSegment && lastSegment !== 'people' && !isAddingNew) {
            setPeopleId(lastSegment);
            setEditPeople(false);
        } else if (idFromQuery && !isAddingNew) {
            setPeopleId(idFromQuery);
            setEditPeople(false);
        } else if (!isAddingNew) {
            setPeopleId(null);
            setEditPeople(false);
        }
        // isAddingNew state will control when the colorId is null for the AddNew form
    }, [pathname, searchParams, isAddingNew]);

    const handlePersonUpdate = (updatedPeople: People) => {
        console.log('Color updated in Colors component:', updatedPeople);
        setPeopleId(null);
        setEditPeople(false);
        setIsAddingNew(false); // Ensure this is also reset
        router.push('/people');
    };

    const handlePersonAdded = (newPeople: People) => {
        console.log('Color added in Colors component:', newPeople);
        setPeopleId(newPeople._id.toString()); // Optionally navigate to the new color's details or edit page
        setEditPeople(false); // Reset edit mode after adding
        setIsAddingNew(false);
        router.push(`/people?id=${newPeople._id}`); // Navigate to the new color's page
    };

    const onEdit = (id: string) => {
        console.log('Edit button clicked for color ID:', id);
        setPeopleId(id);
        setEditPeople(true);
        setIsAddingNew(false); // Ensure we are not in adding new mode
    };

    // MOVE THIS FUNCTION DEFINITION HERE, BEFORE THE RETURN STATEMENT
    const handleDeletePerson = async (id: string) => {
        if (!isAdmin) {
            setDeleteError("You do not have permission to delete person.");
            return;
        }
        if (!window.confirm("Are you sure you want to delete this person?")) {
            return;
        }
        try {
            const res = await fetch(`/api/people?id=${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) {
                const errorData = await res.json(); // Assuming the error response is also JSON
                throw new Error(errorData.message || `Failed to delete color. Status: ${res.status}`);
            }
            console.log(`Color with ID ${id} deleted successfully.`);
            setPeopleId(null); // Clear the selected color ID
            router.push('/people'); // Redirect to the main colors list
        } catch (err: any) {
            setDeleteError(err.message || "An error occurred while deleting the color.");
            console.error(err);
        }
    };
    

    const handleAddNewClick = () => {
        setIsAddingNew(true);
        setPeopleId(null); // Set colorId to null for the blank form
        setEditPeople(true); // Show the edit component with a blank form
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        setPeopleId(null);
        setEditPeople(false);
    };

    return (
        <main>
            {deleteError && <p className="error-message">{deleteError}</p>}
            {isAddingNew && isAdmin ? (
                <EditPerson
                    peopleId={null} // Pass null to indicate adding new
                    onPersonUpdate={handlePersonUpdate}
                    onPersonAdded={handlePersonAdded}
                    // onClose={handleCancelAdd} // You might want a cancel button in EditColors
                />
            ) : peopleId && editPeople && isAdmin ? (
                <EditPerson
                    peopleId={peopleId}
                    onPersonUpdate={handlePersonUpdate}
                    // onClose={() => {
                    //     setColorId(null);
                    //     setEditColor(false);
                    // }}
                />
            ) : peopleId ? (
                <PersonDetailsDisplay
                    personId={peopleId}
                    onEdit={onEdit}
                    onDelete={handleDeletePerson} // Now handleDeleteColor is defined before being used
                />
            ) : (
                <AllPeople onAddNewClick={handleAddNewClick} /* onEditClick should NOT be here */ />
            )}
        </main>
    );
};

export default Person;
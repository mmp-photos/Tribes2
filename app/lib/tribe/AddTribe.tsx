"use client";
import React, { useState, useEffect, useRef } from "react";
import { Tribe } from "../types/tribes";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useAuth } from "../../context/AuthContext";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";
import BooleanCheckbox from "../database/CheckBox";
import FormatDate from '../database/FormatDate';
import { People, PersonId } from "../types/people";

interface TribeProps {
    tribeId: string | null; // Allow null for adding new
    onTribeUpdate: (updatedPerson: Tribe) => void;
    onTribeAdded?: (newPerson: Tribe) => void;
}

const EditTribe: React.FC<TribeProps> = ({ tribeId, onTribeUpdate, onTribeAdded }) => {
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [personDetails, setPersonDetails] = useState<Tribe | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<any>(null); // Initialize to null

    const [data, setData] = useState<Tribe[]>([]);
    const formikRef = useRef<FormikProps<Tribe>>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchTribeDetails = async () => {
        if (!tribeId) {
            setPersonDetails(null);
            setInitialFormValues(null);
            return;
        }
        setLoadingDetails(true);
        setError(null);
        try {
            const res = await fetch(`/api/people?id=${encodeURIComponent(tribeId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);
            const result = await res.json();
            const fetchedTribeDetails = result.person;
            if (fetchedTribeDetails && typeof fetchedTribeDetails.biography !== 'string') {
                fetchedTribeDetails.biography = String(fetchedTribeDetails.biography);
                console.warn(`Biography for person ID ${tribeId} was not a string. Converted to:`, fetchedTribeDetails.biography);
            }
            setPersonDetails(fetchedTribeDetails);
        } catch (err) {
            setError("There was an error fetching person details.");
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchTribeDetails();
    }, [tribeId]);

    const startAddNew = () => {
        setIsAddingNew(true);
    };

    const updatePeople = async (values: Tribe) => {
        try {
            const res = await fetch("/api/tribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to send request. Status: ${res.status}`);
            }

            const result = await res.json();
            if (result.person._id && !tribeId) {
                onTribeAdded?.(result.person);
                setIsAddingNew(false); // Reset to edit mode
            } else {
                onTribeUpdate(result.person); // Existing person updated
            }
            setError(null);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        const formatDateForInput = (dateString: string | Date | null | undefined): string => {
            if (!dateString) {
                return '';
            }
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '';
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            console.log(`New date is ${year}-${month}-${day}`);
            return `${year}-${month}-${day}`;
        };

        if (isAddingNew) {
            setInitialFormValues({ 
                firstName: "",
                });
        } else if (personDetails?._id && isAdmin) {
            setInitialFormValues({
                _id: personDetails._id,
                createdBy: personDetails.createdBy,
            });
        } else {
            setInitialFormValues(null); // Or some default empty object if needed
        }
    }, [personDetails, isAdmin, isAddingNew, profileId]);

    const handleCancelAdd = () => {
        setIsAddingNew(false);
    };

    const MDEditorField = ({ field, form }: any) => (
        <MDEditor
            value={field.value}
            onChange={(value?: string) => {
                if (value !== undefined) {
                    form.setFieldValue(field.name, value);
                }
            }}
        />
    );

    return(
        <div>
            {(isAddingNew || initialFormValues) ? ( // Only render Formik if initialFormValues is populated
                <Formik
                    innerRef={formikRef}
                    initialValues={initialFormValues || {}} // Provide an empty object as fallback
                    // enableReinitialize={false} // Removed
                    validationSchema={Yup.object({
                        firstName: Yup.string().required("Person first name is required"),
                        lastName: Yup.string().required("Person last name is required"),
                        biography: Yup.string(),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        updatePeople(values as Tribe).finally(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <Field type="text" name="firstName" />
                                <ErrorMessage name="firstName" component="div" className="firstName" />
                            </div>
                            <button type="submit" disabled={isSubmitting}>
                                {isAddingNew ? 'Add Person' : 'Update Person'}
                            </button>
                            {isAddingNew && (
                                <button type="button" onClick={handleCancelAdd}>
                                    Cancel
                                </button>
                            )}
                        </Form>
                    )}
                </Formik>
            ) : (
                isAdmin && loadingDetails ? <p>Loading person details...</p> : null
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}
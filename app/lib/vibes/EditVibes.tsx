"use client";
import React, { useState, useEffect, useRef } from "react";
import { Vibes } from "../types/vibes";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useAuth } from "../../context/AuthContext";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";

interface EditVibeProps {
    vibeId: string | null;
    onVibeUpdate: (updatedVibe: Vibes) => void;
    onVibeAdded?: (newVibe: Vibes) => void;
}

const EditVibes: React.FC<EditVibeProps> = ({ vibeId, onVibeUpdate, onVibeAdded }) => {
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [vibeDetails, setVibeDetails] = useState<Vibes | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<any>(null); // Initialize to null

    const [data, setData] = useState<Vibes[]>([]);
    const formikRef = useRef<FormikProps<Vibes>>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchVibeDetails = async () => {
        if (!vibeId) {
            setVibeDetails(null);
            setInitialFormValues(null);
            return;
        }
        setLoadingDetails(true);
        setError(null);
        try {
            const res = await fetch(`/api/vibes?id=${encodeURIComponent(vibeId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);
            const result = await res.json();
            const fetchedVibeDetails = result.vibe;
            console.log(`Fetched Details are ${result.vibe}`);
            if (fetchedVibeDetails && typeof fetchedVibeDetails.biography !== 'string') {
                fetchedVibeDetails.biography = String(fetchedVibeDetails.biography);
                console.warn(`Description for vibe ID ${vibeId} was not a string. Converted to:`, fetchedVibeDetails.biography);
            }
            setVibeDetails(fetchedVibeDetails);
        } catch (err) {
            setError("There was an error fetching vibe details.");
            console.error(err);
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchVibeDetails();
    }, [vibeId]);

    const startAddNew = () => {
        setIsAddingNew(true);
    };

    const updateVibe = async (values: Vibes) => {
        try {
            const res = await fetch("/api/vibes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to send request. Status: ${res.status}`);
            }

            const result = await res.json();
            if (result.vibe._id && !vibeId) {
                onVibeAdded?.(result.vibe);
                setIsAddingNew(false);
            } else {
                onVibeUpdate(result.vibe);
            }
            setError(null);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        if (isAddingNew) {
            setInitialFormValues({ 
                vibe: "",
                defaultPhoto: {
                    photoId: "",
                    caption: ""
                },
                additionalPhotos: [],
                status: "ok",
                createdBy: profileId,
             });
        } else if (vibeDetails?._id && isAdmin) {
            setInitialFormValues({
                _id: vibeDetails._id,
                vibe: vibeDetails.vibe,
                defaultPhoto: vibeDetails.defaultPhoto,
                description: vibeDetails.description,
                status: vibeDetails.status,
                createdBy: vibeDetails.createdBy,
            });
        } else {
            setInitialFormValues(null); // Or some default empty object if needed
        }
    }, [vibeDetails, isAdmin, isAddingNew, profileId]);

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
    
    return (
        <div>
            {!isAddingNew && !vibeDetails && !loadingDetails && (
                <>
                <h2>Edit Vibe</h2>
                <button onClick={startAddNew}>Add New Vibe</button>
                </>
            )}

            {(isAddingNew || initialFormValues) ? (
                <Formik
                    innerRef={formikRef}
                    initialValues={initialFormValues || {}}
                    validationSchema={Yup.object({
                        vibe: Yup.string().required("Vibe name is required"),
                        description: Yup.string(),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        updateVibe({ ...values, createdBy: profileId } as Vibes).finally(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <div>
                                <label htmlFor="vibe">vibe</label>
                                <Field type="text" name="vibe" />
                                <ErrorMessage name="vibe" component="div" className="firstName" />
                            </div>
                            <div>
                                <label htmlFor="description">Description</label>
                                <Field name="description" component={MDEditorField} />
                                <ErrorMessage name="description" component="div" className="form-error" />
                            </div>
                            {isAddingNew && (
                                <Field type="hidden" name="createdBy" value={profileId} />
                            )}
                            <button type="submit" disabled={isSubmitting}>
                                {isAddingNew ? 'Add Vibe' : 'Update Vibe'}
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
                isAdmin && loadingDetails ? <p>Loading vibe details...</p> : null
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}

export default EditVibes;
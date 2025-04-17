"use client";
import React, { useState, useEffect, useRef } from "react";
import { People, PersonId } from "../types/people";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useAuth } from "../../context/AuthContext";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";

interface EditPersonProps {
    peopleId: string | null; // Allow null for adding new
    onPersonUpdate: (updatedPerson: People) => void;
    onPersonAdded?: (newPerson: People) => void;
}

const EditPerson: React.FC<EditPersonProps> = ({ peopleId, onPersonUpdate, onPersonAdded }) => {
    console.log(`People ID pased to function is ${peopleId}`);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [personDetails, setPersonDetails] = useState<People | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<any>(null);
    const [data, setData] = useState<People[]>([]);
    const formikRef = useRef<FormikProps<People>>(null);

    const fetchPersonDetails = async () => {
        if (!peopleId) {
            setPersonDetails(null); // No need to fetch if adding new
            return;
        }
        try {
            const res = await fetch(`/api/people?id=${encodeURIComponent(peopleId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);
            const result = await res.json();
            const fetchedPersonDetails = result.person;
            if (fetchedPersonDetails && typeof fetchedPersonDetails.biography !== 'string') {
                fetchedPersonDetails.biography = String(fetchedPersonDetails.biography);
                console.warn(`Biography for person ID ${peopleId} was not a string. Converted to:`, fetchedPersonDetails.biography);
            }
            setPersonDetails(fetchedPersonDetails);
        } catch (err) {
            setError("There was an error fetching person details.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPersonDetails();
        if(personDetails){
        console.log(`The person loaded by fetchPersonDetails is ${personDetails.firstName}`)
        }
        else {
            console.log(`No person returned`);
        }
    }, [peopleId]);

    const startAddNew = () => {
        setIsAddingNew(true);
        // Optionally reset personId if it's being passed down
        // if (personId) {
        //   onPersonUpdate(null); // Or however you signal a reset
        // }
    };

    const updatePeople = async (values: People) => {
        try {
            const res = await fetch("/api/people", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to send request. Status: ${res.status}`);
            }

            const result = await res.json();
            if (result.person._id && !peopleId) {
                // New person added
                onPersonAdded?.(result.person);
                setIsAddingNew(false); // Reset to edit mode
                // Optionally clear the form or navigate
            } else {
                onPersonUpdate(result.person); // Existing person updated
            }
            setError(null);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    useEffect(() => {
        if (isAddingNew) {
            setInitialFormValues({
                firstName: "",
                lastName: "",
                nickname: "",
                biography: "",
                dob: null,
                dod: null,
                icon: false,
                defaultPhoto: {},
                additionalPhotos: [],
                connections: [],
                status: "ok",
                createdBy: profileId || "",
            });
        } else if (personDetails?._id && isAdmin) {
            setInitialFormValues({
                _id: personDetails._id,
                firstName: personDetails.firstName,
                lastName: personDetails.lastName,
                nickName: personDetails.nickName || "", // Add a fallback in case nickname is undefined
                biography: personDetails.biography || "", // Use personDetails.biography here with a fallback
                dob: personDetails.dob,
                dod: personDetails.dod,
                icon: personDetails.icon,
                defaultPhoto: personDetails.defaultPhoto,
                additionalPhotos: personDetails.additionalPhotos,
                connections: personDetails.connections,
                status: personDetails.status,
                createdBy: personDetails.createdBy,
            });
        } else {
            setInitialFormValues({
                firstName: "",
                lastName: "",
                nickName: "",
                biography: "",
                dob: null,
                dod: null,
                icon: false,
                defaultPhoto: {},
                additionalPhotos: [],
                connections: [],
                status: "ok",
                createdBy: profileId || "",
            });
        }
    }, [personDetails, isAdmin, isAddingNew, profileId]);
    
    const handleCancelAdd = () => {
        setIsAddingNew(false);
        // Optionally reset the form or navigate
    };

    let biography = "Are you going to go my way.";

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
            {!isAddingNew && !personDetails && (
                <button onClick={startAddNew}>Add New Person</button>
            )}

            {(isAddingNew || (personDetails && initialFormValues)) ? (
                <Formik
                    innerRef={formikRef}
                    initialValues={initialFormValues}
                    enableReinitialize={true}
                    validationSchema={Yup.object({
                        firstName: Yup.string().required("Person first name is required"),
                        lastName: Yup.string().required("Person last name is required"),
                        biography: Yup.string(),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        updatePeople(values as People).finally(() => setSubmitting(false));
                    }}
                >
                    {({ isSubmitting, values }) => (
                        <Form>
                            <div>
                                <label htmlFor="firstName">First Name</label>
                                <Field type="text" name="firstName" />
                                <ErrorMessage name="firstName" component="div" className="firstName" />
                            </div>
                            <div>
                                <label htmlFor="lastName">Last Name</label>
                                <Field type="text" name="lastName" />
                                <ErrorMessage name="lastName" component="div" className="lastName" />
                            </div>
                            <div>
                                <label htmlFor="biography">Biography</label>
                                <Field name="biography" component={MDEditorField} />
                                <ErrorMessage name="biography" component="div" className="form-error" />
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
                isAdmin && <p>Loading person details...</p>
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}

export default EditPerson;
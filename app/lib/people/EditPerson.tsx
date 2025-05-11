"use client";
import React, { useState, useEffect, useRef } from "react";
import { People, PersonId } from "../types/people";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useAuth } from "../../context/AuthContext";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";
import BooleanCheckbox from "../database/CheckBox";
import FormatDate from '../database/FormatDate';

interface EditPersonProps {
    peopleId: string | null; // Allow null for adding new
    onPersonUpdate: (updatedPerson: People) => void;
    onPersonAdded?: (newPerson: People) => void;
}

interface CheckProps {
    props: {
        name: string | null,

    }
}

const EditPerson: React.FC<EditPersonProps> = ({ peopleId, onPersonUpdate, onPersonAdded }) => {
    console.log(`People ID pased to function is ${peopleId}`);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [personDetails, setPersonDetails] = useState<People | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [initialFormValues, setInitialFormValues] = useState<any>(null); // Initialize to null

    const [data, setData] = useState<People[]>([]);
    const formikRef = useRef<FormikProps<People>>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchPersonDetails = async () => {
        if (!peopleId) {
            setPersonDetails(null);
            setInitialFormValues(null); // Reset initialFormValues as well
            return;
        }
        setLoadingDetails(true);
        setError(null);
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
        } finally {
            setLoadingDetails(false);
        }
    };

    useEffect(() => {
        fetchPersonDetails();
    }, [peopleId]);

    const startAddNew = () => {
        setIsAddingNew(true);
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
                onPersonAdded?.(result.person);
                setIsAddingNew(false); // Reset to edit mode
            } else {
                onPersonUpdate(result.person); // Existing person updated
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
                lastName: "",
                nickName: "",
                biography: "",
                dob: new Date().toISOString().split('T')[0],
                dod: new Date().toISOString().split('T')[0],
                icon: false,
                fictional: false,
                defaultPhoto: {
                    photoId: "",
                    caption: ""
                },
                additionalPhotos: [],
                connections: [],
                status: "ok",
                createdBy: "",
             });
        } else if (personDetails?._id && isAdmin) {
            setInitialFormValues({
                _id: personDetails._id,
                firstName: personDetails.firstName,
                lastName: personDetails.lastName,
                nickName: personDetails.nickName || "",
                biography: personDetails.biography || "",
                dob: formatDateForInput(personDetails.dob),
                dod: formatDateForInput(personDetails.dod),
                icon: personDetails.icon,
                fictional: personDetails.fictional,
                defaultPhoto: personDetails.defaultPhoto,
                additionalPhotos: personDetails.additionalPhotos,
                connections: personDetails.connections,
                status: personDetails.status,
                createdBy: personDetails.createdBy,
            });
        } else {
            setInitialFormValues(null); // Or some default empty object if needed
        }
    }, [personDetails, isAdmin, isAddingNew, profileId]);

    const handleCancelAdd = () => {
        setIsAddingNew(false);
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
    
    return (
        <div>
            {!isAddingNew && !personDetails && !loadingDetails && (
                <button onClick={startAddNew}>Add New Person</button>
            )}

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
                                <label htmlFor="nickName">Nick Name</label>
                                <Field type="text" name="nickName" />
                                <ErrorMessage name="nickName" component="div" className="nickName" />
                            </div>                    
                            <div>
                                <BooleanCheckbox name="icon" label="Icon" />
                            </div>
                            <div>
                                <BooleanCheckbox name="fictioanl" label="Fictional Character" />
                            </div>
                            <div>
                                <label htmlFor="dob">Date of Birth</label>
                                <Field type="date" name="dob" />
                                <ErrorMessage name="dob" component="div" className="dod" />
                            </div>
                            <div>
                                <label htmlFor="dod">Date of Death</label>
                                <Field type="date" name="dod" />
                                <ErrorMessage name="dod" component="div" className="dod" />
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
                isAdmin && loadingDetails ? <p>Loading person details...</p> : null
            )}
            {error && <p className="error-message">{error}</p>}
        </div>
    )
}

export default EditPerson;
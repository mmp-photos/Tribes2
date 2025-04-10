"use client";
import React, { useState, useEffect, useRef } from "react";
import { Color, ColorId } from "../types/color";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";
import ColorDetailsDisplay from './ColorDetails';

interface EditColorsProps {
    colorId: string | null; // Allow null for adding new
    onColorUpdate: (updatedColor: Color) => void;
    onColorAdded?: (newColor: Color) => void; // Optional prop for handling new color
}

const EditColors: React.FC<EditColorsProps> = ({ colorId, onColorUpdate, onColorAdded }) => {
    const [colorDetails, setColorDetails] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const formikRef = useRef<FormikProps<{
        colorName: string;
        colorValue: string;
        complementaryColors: string[];
        contrastingColors: string[];
        colorDescription: string;
    }>>(null);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [data, setData] = useState<Color[]>([]);
    const [initialFormValues, setInitialFormValues] = useState<any>(null);
    const [initialName, setInitialName] = useState<string>();

    const getAllColors = async () => {
        try {
            const res = await fetch(`/api/colors`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);
            const result = await res.json();
            setData(result.colors || []);
        } catch (err: any) {
            setError("There was an error fetching the OK colors.");
            console.error(err);
        }
    };

    useEffect(() => {
        getAllColors();
    }, []);

    const updateColor = async (values: Color) => {
        try {
            const res = await fetch("/api/colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `Failed to send request. Status: ${res.status}`);
            }

            const result = await res.json();
            if (result.color._id && !colorId) {
                // New color added
                onColorAdded?.(result.color);
                setIsAddingNew(false); // Reset to edit mode
                // Optionally clear the form or navigate
            } else {
                onColorUpdate(result.color); // Existing color updated
            }
            setError(null);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    const fetchColorDetails = async () => {
        if (!colorId) {
            setColorDetails(null); // No need to fetch if adding new
            return;
        }
        try {
            const res = await fetch(`/api/colors?id=${encodeURIComponent(colorId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);
            const result = await res.json();
            const fetchedColorDetails = result.colors[0];
            setColorDetails(fetchedColorDetails);
        } catch (err) {
            setError("There was an error fetching color details.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchColorDetails();
    }, [colorId]);

    useEffect(() => {
        if (isAddingNew) {
            setInitialFormValues({
                colorName: "",
                colorValue: "",
                createdBy: profileId || "",
                complementaryColors: [],
                contrastingColors: [],
                colorDescription: ""
            });
        } else if (colorDetails?._id && isAdmin) {
            setInitialFormValues({
                _id: colorDetails._id,
                colorName: colorDetails.colorName,
                colorValue: colorDetails.colorValue,
                createdBy: colorDetails.createdBy,
                complementaryColors: colorDetails.complementaryColors
                    ? colorDetails.complementaryColors.map(relatedColor => {
                        if (relatedColor && typeof relatedColor === 'object' && '_id' in relatedColor) {
                            return relatedColor._id.toString();
                        }
                        // Handle cases where the related color might not be fully populated
                        console.warn("Unexpected structure in complementaryColors:", relatedColor);
                        return ''; // Or some other appropriate default
                    })
                    : [],
                contrastingColors: colorDetails.contrastingColors
                    ? colorDetails.contrastingColors.map(relatedColor => {
                        if (relatedColor && typeof relatedColor === 'object' && '_id' in relatedColor) {
                            return relatedColor._id.toString();
                        }
                        // Handle cases where the related color might not be fully populated
                        console.warn("Unexpected structure in contrastingColors:", relatedColor);
                        return ''; // Or some other appropriate default
                    })
                    : [],
                colorDescription: colorDetails.colorDescription
            });
        } else {
            setInitialFormValues({
                colorName: "",
                colorValue: "",
                createdBy: profileId || "",
                complementaryColors: [],
                contrastingColors: [],
                colorDescription: ""
            });
        }
    }, [colorDetails, isAdmin, isAddingNew, profileId]);
    
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

    const handleComplementaryColorClick = (clickedColorId: string) => {
        if (formikRef.current) {
            const currentComplementaryColors = formikRef.current.values.complementaryColors || [];
            const isSelected = currentComplementaryColors.includes(clickedColorId);
            const updatedComplementaryColors = isSelected
                ? currentComplementaryColors.filter((id) => id !== clickedColorId)
                : [...currentComplementaryColors, clickedColorId];
            formikRef.current.setFieldValue('complementaryColors', updatedComplementaryColors);
        }
    };

    const handleContrastingColorClick = (clickedColorId: string) => {
        if (formikRef.current) {
            const currentContrastingColors = formikRef.current.values.contrastingColors || [];
            const isSelected = currentContrastingColors.includes(clickedColorId);
            const updatedContrastingColors = isSelected
                ? currentContrastingColors.filter((id) => id !== clickedColorId)
                : [...currentContrastingColors, clickedColorId];
            formikRef.current.setFieldValue('contrastingColors', updatedContrastingColors);
        }
    };

    const startAddNew = () => {
        setIsAddingNew(true);
        // Optionally reset colorId if it's being passed down
        // if (colorId) {
        //   onColorUpdate(null); // Or however you signal a reset
        // }
    };

    const handleCancelAdd = () => {
        setIsAddingNew(false);
        // Optionally reset the form or navigate
    };

    return (
        <>
            {isAdmin && (
                <div>
                    {!isAddingNew && !colorDetails && (
                        <button onClick={startAddNew}>Add New Color</button>
                    )}

                    {(isAddingNew || (colorDetails && initialFormValues)) ? (
                        <Formik
                            innerRef={formikRef}
                            initialValues={initialFormValues}
                            enableReinitialize={true}
                            validationSchema={Yup.object({
                                colorName: Yup.string().required("Color name is required"),
                                colorValue: Yup.string().required("Color value is required"),
                                colorDescription: Yup.string(),
                            })}
                            onSubmit={(values, { setSubmitting }) => {
                                updateColor(values as Color).finally(() => setSubmitting(false));
                            }}
                        >
                            {({ isSubmitting, values }) => (
                                <Form>
                                    <div>
                                        <label htmlFor="colorName">Color Name</label>
                                        <Field type="text" name="colorName" />
                                        <ErrorMessage name="colorName" component="div" className="colorName" />
                                    </div>
                                    <div>
                                        <label htmlFor="colorValue">Color Value</label>
                                        <Field type="text" name="colorValue" />
                                        <ErrorMessage name="colorValue" component="div" className="colorValue" />
                                    </div>
                                    <div>
                                        <label htmlFor="colorDescription">Color Description</label>
                                        <Field name="colorDescription" component={MDEditorField} />
                                        <ErrorMessage name="colorDescription" component="div" />
                                    </div>
                                    <div>
                                        <h4>Complementary Colors</h4>
                                        <label htmlFor="complementaryColors">Currently Selected:</label>
                                        <ul className="colors show" id="selectedComplementaryColors">
                                            {data
                                                .filter(color =>
                                                    (values.complementaryColors || []).includes(color._id.toString())
                                                )
                                                .map(color => (
                                                    <li
                                                        key={color._id.toString()}
                                                        className="color-swatch-small swatch-selected"
                                                        style={{ backgroundColor: `#${color.colorValue}` }}
                                                        onClick={() => handleComplementaryColorClick(color._id.toString())}
                                                    ></li>
                                                ))}
                                        </ul>
                                        <p>Available Colors:</p>
                                        <ul className="colors show" id="availableComplementaryColors">
                                            {data
                                                .filter(color => !(values.complementaryColors || []).includes(color._id.toString()))
                                                .map(color => (
                                                    <li
                                                        key={color._id.toString()}
                                                        className={`color-swatch-small ${values.complementaryColors?.includes(color._id.toString()) ? 'swatch-selected' : ''}`}
                                                        style={{ backgroundColor: `#${color.colorValue}` }}
                                                        onClick={() => handleComplementaryColorClick(color._id.toString())}
                                                    ></li>
                                                ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>Contrasting Colors</h4>
                                        <label htmlFor="contrastingColors">Currently Selected:</label>
                                        <ul className="colors show" id="selectedContrastingColors">
                                            {data
                                                .filter(color =>
                                                    (values.contrastingColors || []).includes(color._id.toString())
                                                )
                                                .map(color => (
                                                    <li
                                                        key={color._id.toString()}
                                                        className="color-swatch-small swatch-selected"
                                                        style={{ backgroundColor: `#${color.colorValue}` }}
                                                        onClick={() => handleContrastingColorClick(color._id.toString())}
                                                    ></li>
                                                ))}
                                        </ul>
                                        <p>Available Colors:</p>
                                        <ul className="colors show" id="availableContrastingColors">
                                            {data
                                                .filter(color => !(values.contrastingColors || []).includes(color._id.toString()))
                                                .map(color => (
                                                    <li
                                                        key={color._id.toString()}
                                                        className={`color-swatch-small ${values.contrastingColors?.includes(color._id.toString()) ? 'swatch-selected' : ''}`}
                                                        style={{ backgroundColor: `#${color.colorValue}` }}
                                                        onClick={() => handleContrastingColorClick(color._id.toString())}
                                                    ></li>
                                                ))}
                                        </ul>
                                    </div>
                                    <button type="submit" disabled={isSubmitting}>
                                        {isAddingNew ? 'Add Color' : 'Update Color'}
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
                        isAdmin && <p>Loading color details...</p>
                    )}
                    {error && <p className="error-message">{error}</p>}
                </div>
            )}
        </>
    );
}
export default EditColors;
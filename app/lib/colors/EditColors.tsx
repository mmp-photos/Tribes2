"use client";
import React, { useState, useEffect, useRef } from "react";
import { Color, ColorId } from "../types/color";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";
import ColorDetailsDisplay from './ColorDetails';

interface EditColorsProps {
    colorId: string;
    onColorUpdate: (updatedColor: Color) => void;
}

const EditColors: React.FC<EditColorsProps> = ({ colorId, onColorUpdate }) => {
    const [colorDetails, setColorDetails] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const formikRef = useRef<FormikProps<{
        colorName: string;
        colorValue: string;
        complementaryColors: string[];
        contrastingColors: string[];
        colorDescription: string;
    }>>(null);
    const [colorLoaded, setColorLoaded] = useState<boolean>(false);
    const { isAdmin, profileId } = useAuth();
    const [data, setData] = useState<Color[]>([]);
    const [initialFormValues, setInitialFormValues] = useState<any>(null);
    const [initialName, setInitialName] = useState<string>();

    // const getAllColors = async (findColors: ColorId[]) => {
    //     try {
    //         const res = await fetch(`/api/colors?${findColors.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&")}`, {
    //             method: "GET",
    //             headers: { "Content-Type": "application/json" },
    //         });

    //         if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

    //         const result = await res.json();
    //         setData(result.colors || []);
    //     } catch (err: any) {
    //         setError("There was an error fetching the colors.");
    //     }
    // };

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
            onColorUpdate(result.color); // Notify parent component
            setError(null);

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    const fetchColorDetails = async () => {
        try {
            const res = await fetch(`/api/colors?id=${encodeURIComponent(colorId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(`Result from fetchColorDetails: ${result}`);
            const fetchedColorDetails = result.colors[0];
            setColorDetails(fetchedColorDetails);
            console.log(`Color details passed to setInitialFormValues: ${colorDetails}`)
        }
        catch{

        }
    };
    useEffect(() =>{
        fetchColorDetails()
    }, [colorId]);

    useEffect(() =>{
        if (colorDetails?.colorName && isAdmin) {
            setInitialFormValues({
                colorName: colorDetails.colorName,
                colorValue: colorDetails.colorValue,
                createdBy:  colorDetails.createdBy,
                complementaryColors: colorDetails.complementaryColors,
                contrastingColors: colorDetails.contrastingColors,
                colorDescription: colorDetails.colorDescription
            })
        }
        else {
            setInitialFormValues({
                colorName: "",
                colorValue: "",
                createdBy:  "",
                complementaryColors: [],
                contrastingColors: [],
                colorDescription: "This is a test"
            })
        };
    }, [colorDetails])

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
    console.log(`isAdmin: ${isAdmin}.  colorDetails: ${colorDetails}, initialFormValues: ${initialFormValues}`)
    return (
        <>
            {isAdmin && colorDetails && initialFormValues ? (
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
                        const formattedValues: Color = {
                            ...values,
                            _id: colorDetails._id,
                            // complementaryColors: values.complementaryColors,
                            // contrastingColors: values.contrastingColors,
                        };
                        updateColor(formattedValues).finally(() => setSubmitting(false));
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
                                    <label htmlFor="complementaryColors">Complementary Colors</label>
                                    <ul className="colors show" id="complementaryColors">
                                        {data.map((color) => {
                                            const isSelected = values.complementaryColors.includes(color._id.toString());
                                            return (
                                                <li
                                                    key={color._id.toString()}
                                                    className={`color-swatch-small ${isSelected ? 'swatch-selected' : ''}`}
                                                    style={{ backgroundColor: `#${color.colorValue}` }}
                                                    onClick={() => handleComplementaryColorClick(color._id.toString())}
                                                ></li>
                                            );
                                        })}
                                    </ul>
                                </div>
                                <div>
                                    <label htmlFor="contrastingColors">Contrasting Colors</label>
                                     <ul className="colors show" id="contrastingColors">
                                        {data.map((color) => {
                                            const isSelected = values.contrastingColors.includes(color._id.toString());
                                            return (
                                                <li
                                                    key={color._id.toString()}
                                                    className={`color-swatch-small ${isSelected ? 'swatch-selected' : ''}`}
                                                    style={{ backgroundColor: `#${color.colorValue}` }}
                                                    onClick={() => handleContrastingColorClick(color._id.toString())}
                                                ></li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            <button type="submit" disabled={isSubmitting}>
                                Submit
                            </button>
                             {/* <button type="button" onClick={onClose}>
                                Cancel
                            </button> */}
                        </Form>
                    )}
                </Formik>
            ) : (
                isAdmin && <p>Loading color details...</p>
            )}
            {error && <p className="error-message">{error}</p>}
        </>
    );
};

export default EditColors;
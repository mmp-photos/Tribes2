"use client";
import React, { useState, useEffect, useRef } from "react";
import { Color, ColorId } from "../types/color";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";
import ColorDetailsDisplay from './ColorDetails';

const AllColors: React.FC = () => {
    const [data, setData] = useState<Color[]>([]);
    const [colorDetails, setColorDetails] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resStatus, setResStatus] = useState<number | null>(null);
    const [showBlankForm, setShowBlankForm] = useState<boolean>(false);
    const formikRef = useRef<FormikProps<{
        colorName: string;
        colorValue: string;
        complementaryColors: string[];
        contrastingColors: string[];
        colorDescription: string; // Add colorDescription to form
    }>>(null);
    
    const findColors: ColorId[] = [];
    const queryString = findColors.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&");
    const { isAdmin, profileId } = useAuth();

    const updateColor = async (values: Color) => {
        try {
            const res = await fetch("/api/colors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            const status = res.status;
            setResStatus(status);
            if (!res.ok) {
                const errorData = await res.json();  //attempt to get error message.
                throw new Error(errorData.message || `Failed to send request. Status: ${res.status}`); //use the message
            }

            const result = await res.json();
            console.log(res);
            setData(result.colors || []);
            setColorDetails(null);
            setShowBlankForm(false);
            setError(null);

            if (result?.color?._id) { //check if new color was created and has an ID
                editColor(result.color._id.toString()); // Fetch the new color details.
            }

        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
    };

    const getAllColors = async (findColors: ColorId[]) => {
        try {
            const res = await fetch(`/api/colors?${queryString}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            setData(result.colors || []);
        } catch (err: any) {
            setError("There was an error fetching the colors.");
        }
    };

    const editColor = async (colorId: string) => {
        try {
            const res = await fetch(`/api/colors?ids=${encodeURIComponent(colorId)}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) throw new Error(`Failed request. Status: ${res.status}`);

            const result = await res.json();
            console.log(result);
            setColorDetails(result.colors[0] || null);
            setShowBlankForm(false);
        } catch (err: any) {
            setError("There was an error fetching the colors.");
        }
    };

    const colorMouseOver = (e: React.MouseEvent<HTMLLIElement>) => {
        e.currentTarget.classList.add("hovered");
    };

    const colorMouseOut = (e: React.MouseEvent<HTMLLIElement>) => {
        e.currentTarget.classList.remove("hovered");
    };

    const handleComplementaryColorClick = (colorId: string) => {
        if (formikRef.current) {
            const currentComplementaryColors = formikRef.current.values.complementaryColors || [];
            const isSelected = currentComplementaryColors.includes(colorId);

            const updatedComplementaryColors = isSelected
                ? currentComplementaryColors.filter((id) => id !== colorId)
                : [...currentComplementaryColors, colorId];

            formikRef.current.setFieldValue('complementaryColors', updatedComplementaryColors);
        }
    };

    const handleContrastingColorClick = (colorId: string) => {
        if (formikRef.current) {
            const currentContrastingColors = formikRef.current.values.contrastingColors || [];
            const isSelected = currentContrastingColors.includes(colorId);

            const updatedContrastingColors = isSelected
                ? currentContrastingColors.filter((id) => id !== colorId)
                : [...currentContrastingColors, colorId];

            formikRef.current.setFieldValue('contrastingColors', updatedContrastingColors);
        }
    };

    const selectedClass = (colorId: string, colorsArray: string[]) => {
        return colorsArray.includes(colorId) ? "swatch-selected" : "";
    };

    useEffect(() => {
        getAllColors(findColors);
    }, []);

    useEffect(() => {
        if (colorDetails && formikRef.current && isAdmin) {
            const complementaryIds = colorDetails.complementaryColors?.map((c: any) => c._id?.toString() || c.toString()) || [];
            const contrastingIds = colorDetails.contrastingColors?.map((c: any) => c._id?.toString() || c.toString()) || [];

            formikRef.current.setValues({
                colorName: colorDetails.colorName || "",
                colorValue: colorDetails.colorValue || "",
                complementaryColors: complementaryIds,
                contrastingColors: contrastingIds,
                colorDescription: colorDetails.colorDescription || "", //set value.
            });
        }
    }, [colorDetails, isAdmin]);

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
        <>
            {isAdmin ? (
                (colorDetails || showBlankForm) && (
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            colorName: colorDetails?.colorName || "",
                            colorValue: colorDetails?.colorValue || "",
                            createdBy: profileId || "",
                            complementaryColors: colorDetails?.complementaryColors?.map((c: any) => c._id?.toString() || c.toString()) || [],
                            contrastingColors: colorDetails?.contrastingColors?.map((c: any) => c._id?.toString() || c.toString()) || [],
                            colorDescription: colorDetails?.colorDescription || "", // Initial value
                        }}
                        validationSchema={Yup.object({
                            colorName: Yup.string().required("Color name is required"),
                            colorValue: Yup.string().required("Color value is required"),
                            colorDescription: Yup.string(),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            const formattedValues: Color = {
                                ...values,
                                _id: colorDetails?._id ?? "new",
                                complementaryColors: values.complementaryColors,
                                contrastingColors: values.contrastingColors,
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
                                    <label htmlFor="colorDescription">
                                        Color Description
                                    </label>
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
                                <button type="submit" disabled={isSubmitting}>Submit</button>
                            </Form>
                        )}
                    </Formik>
                )
            ) : (
                colorDetails ? (
                    <ColorDetailsDisplay colorId={colorDetails._id.toString()} />
                ) : (
                    <p>Sign in as an Administrator</p>
                )
            )}
            {error && <p className="error-message">{error}</p>}
            {resStatus && <p>Status Code: {resStatus}</p>}
        </>
    );
};

export default AllColors;

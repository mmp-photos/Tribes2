"use client";
import React, { useState, useEffect, useRef } from "react";
import { Color, ColorId } from "../types/color";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";

const AllColors: React.FC = () => {
    const [data, setData] = useState<Color[]>([]);
    const [colorDetails, setColorDetails] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resStatus, setResStatus] = useState<string | null>(null);
    const [showBlankForm, setShowBlankForm] = useState<boolean>(false);
    const formikRef = useRef<FormikProps<{ colorName: string; colorValue: string; complementaryColors: string[]; contrastingColors: string[]; colorDescription: string }>>(null);

    const placeHolder = () => {
        console.log(`Click the button`);
    };

    const findColors: ColorId[] = [];

    const queryString = findColors.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&");

    const { isAdmin } = useAuth();

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

    const handleComplementaryColorClick = (colorId: string, colorsArray: string[], colorsArrayName: 'complementaryColors' | 'contrastingColors') => {
        if (formikRef.current) { // Add this check
            const currentColors = formikRef.current.values[colorsArrayName] || [];
            const isSelected = currentColors.includes(colorId);
            const updatedColors = isSelected
                ? currentColors.filter((id) => id !== colorId)
                : [...currentColors, colorId];
    
            formikRef.current.setValues({
                ...formikRef.current.values,
                [colorsArrayName]: updatedColors,
            });
        }
    };
    
    useEffect(() => {
        getAllColors(findColors);
    }, []);

    useEffect(() => {
        if (colorDetails && formikRef.current) {
            formikRef.current.setValues({
                colorName: colorDetails.colorName || "",
                colorValue: colorDetails.colorValue || "",
                complementaryColors: colorDetails.complementaryColors?.map(String) || [],
                contrastingColors: colorDetails.contrastingColors?.map(String) || [],
                colorDescription: colorDetails.colorDescription || "",
            });
        }
    }, [colorDetails]);

    const MDEditorField = ({ field, form }: any) => (
        <MDEditor
            value={field.value}
            onChange={(value?: string | undefined) => {
                if (value !== undefined) {
                    form.setFieldValue(field.name, value);
                }
            }}
        />
    );

    const selectedClass = (colorId: string, colorsArray: string[]) => {
        return colorsArray.includes(colorId) ? "swatch-selected" : "";
    };

    return (
        <>
            <h2>All Colors</h2>
            {data ? (
                <ul className="colors show" id="allColors">
                    {isAdmin && (
                        <li
                            className="color-swatch"
                            style={{ backgroundColor: "var(--background-primary)" }}
                            onClick={() => { setShowBlankForm(true); setColorDetails(null); }}
                        >
                            +
                        </li>
                    )}
                    {data.map((color) => (
                        <li
                            className="color-swatch"
                            onMouseOver={colorMouseOver}
                            onMouseOut={colorMouseOut}
                            onClick={() => editColor(color._id.toString())}
                            key={color._id.toString()}
                            style={{ backgroundColor: `#${color.colorValue}` }}
                        ></li>
                    ))}
                </ul>
            ) : (
                <p>Loading colors...</p>
            )}
            {(colorDetails || showBlankForm) && (
                <Formik
                    innerRef={formikRef}
                    initialValues={{
                        colorName: colorDetails?.colorName || "",
                        colorValue: colorDetails?.colorValue || "",
                        complementaryColors: colorDetails?.complementaryColors?.map(String) || [],
                        contrastingColors: colorDetails?.contrastingColors?.map(String) || [],
                        colorDescription: colorDetails?.colorDescription || "",
                    }}
                    validationSchema={Yup.object({
                        colorName: Yup.string().required("Color name is required"),
                        colorValue: Yup.string().required("Color value is required"),
                    })}
                    onSubmit={(values, { setSubmitting }) => {
                        placeHolder();
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
                                <ErrorMessage name="colorDescription" component="div" className="colorDescription" />
                            </div>
                            <div>
                                <label htmlFor="complementaryColors">Complementary Colors</label>
                                <ul className="colors show" id="complementaryColors">
                                    {data.map((color) => (
                                        <li
                                            key={color._id.toString()}
                                            className={`color-swatch-small ${selectedClass(color._id.toString(), values.complementaryColors)}`}
                                            style={{ backgroundColor: `#${color.colorValue}` }}
                                            onClick={() => handleComplementaryColorClick(color._id.toString(), values.complementaryColors, 'complementaryColors')}
                                        ></li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <label htmlFor="contrastingColors">Contrasting Colors</label>
                                <ul className="colors show" id="contrastingColors">
                                    {data.map((color) => (
                                        <li
                                            key={color._id.toString()}
                                            className={`color-swatch-small ${selectedClass(color._id.toString(), values.contrastingColors)}`}
                                            style={{ backgroundColor: `#${color.colorValue}` }}
                                            onClick={() => handleComplementaryColorClick(color._id.toString(), values.contrastingColors, 'contrastingColors')}
                                        ></li>
                                    ))}
                                </ul>
                            </div>
                            <button type="submit" disabled={isSubmitting}>Submit</button>
                        </Form>
                    )}
                </Formik>
            )}
        </>
    );
};

export default AllColors;
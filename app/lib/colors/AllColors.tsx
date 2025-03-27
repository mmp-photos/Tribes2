"use client";
import React, { useState, useEffect, useRef } from "react";
import { Color, ColorId } from "../types/color";
import { useAuth } from "../../context/AuthContext";
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor"; // Import MDEditor
//import  { EditorRenderHTML }  from "@uiw/react-md-editor"; //  removed EditorRenderHTML from here


const AllColors: React.FC = () => {
    const [data, setData] = useState<Color[]>([]);
    const [colorDetails, setColorDetails] = useState<Color | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [resStatus, setResStatus] = useState<string | null>(null);
    const [showBlankForm, setShowBlankForm] = useState<boolean>(false);
    const formikRef = useRef<FormikProps<{
        colorName: string;
        colorValue: string;
        complementaryColors: string[];
        contrastingColors: string[];
    }>>(null);

    const placeHolder = () => {
        console.log(`Click the button`);
    };

    const findColors: ColorId[] = [];

    const queryString = findColors.map((color) => `ids=${encodeURIComponent(color.toString())}`).join("&");

    const { isAdmin, profileId } = useAuth();

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
            formikRef.current.setValues({
                colorName: colorDetails.colorName || "",
                colorValue: colorDetails.colorValue || "",
                complementaryColors: colorDetails.complementaryColors?.map(String) || [],
                contrastingColors: colorDetails.contrastingColors?.map(String) || [],
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
                            key={color._id?.toString()} // Added toString() here
                            style={{ backgroundColor: `#${color.colorValue}` }}
                        ></li>
                    ))}
                </ul>
            ) : (
                <p>Loading colors...</p>
            )}
            {isAdmin ? (
                (colorDetails || showBlankForm) && (
                    <Formik
                        innerRef={formikRef}
                        initialValues={{
                            colorName: colorDetails?.colorName || "",
                            colorValue: colorDetails?.colorValue || "",
                            profileId: profileId || "",
                            complementaryColors: colorDetails?.complementaryColors?.map(String) || [],
                            contrastingColors: [],
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
                    <div className="color-details">
                        <h3 style={{ color: `#${colorDetails.colorValue}` }}>{colorDetails.colorName}</h3>
                        <p>Color Value: #{colorDetails.colorValue}</p>
                        <div>
                            <h4>Description:</h4>
                           <MDEditor.Markdown  source={colorDetails.colorDescription} />  {/* Render Markdown */}
                        </div>
                        {colorDetails.complementaryColors && colorDetails.complementaryColors.length > 0 && (
                            <div>
                                 <h4>Complementary Colors</h4>
                                 <ul>
                                 {colorDetails.complementaryColors?.map((colorId) => {
                                    const complementaryColor = data.find(c => c._id?.toString() === colorId.toString());
                                    return complementaryColor ? (
                                            <li
                                                key={complementaryColor._id.toString()} // Ensure unique and non-null key
                                                style={{ backgroundColor: `#${complementaryColor.colorValue}` }}
                                            >
                                            </li>
                                        ) : null;
                                    })}
                                 </ul>
                             </div>
                         )}
                         {colorDetails.contrastingColors && colorDetails.contrastingColors.length > 0 && (
                             <div>
                                 <h4>Contrasting Colors</h4>
                                 <ul>
                                     {colorDetails.contrastingColors.map(colorId => {
                                         const contrastingColor = data.find(c => c._id?.toString() === colorId.toString());
                                         return contrastingColor ? (
                                            <li
                                                key={colorId.toString()} // Convert ObjectId to string
                                                style={{ backgroundColor: `#${contrastingColor.colorValue}` }}
                                            >
                                            </li>
                                         ) : null
                                     })}
                                 </ul>
                             </div>
                         )}
                    </div>
                ) : (
                    <p>Sign in as an Administrator</p>
                )
            )}
        </>
    );
};

export default AllColors;

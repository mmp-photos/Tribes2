"use client";
import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikProps } from "formik";
import { useAuth } from "../../context/AuthContext";
import { People, PersonId } from "../types/people";
import HandleNickName from "../people/HandleNickName";
import * as Yup from "yup";
import MDEditor from "@uiw/react-md-editor";

interface ImageUploadFormProps {
  onImageUploaded?: (file: File) => void;
  onError?: (message: string) => void;
}

interface Person {
  _id: string;
  firstName: string;
  lastName: string;
  nickName?: string[]; // nickName is now consistently an array (or undefined)
  status: string;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onImageUploaded, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // CODE ADDED TO HANDLE DATABASE FUNCTIONS
  const [isAddingNew, setIsAddingNew] = useState<boolean>(false);
  const { isAdmin, profileId } = useAuth();
  const [personDetails, setPersonDetails] = useState<People | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [initialFormValues, setInitialFormValues] = useState<any>(null);
  const [data, setData] = useState<People[]>([]);
  const formikRef = useRef<FormikProps<People>>(null);
  const [category, setCategory] = useState('');
  const [referenceOptions, setReferenceOptions] = useState<
    { value: string; label: string; person?: Person }[]
  >([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png'];
    const maxSizeMB = 2.5;
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      onError?.('Please upload a JPG or PNG image.');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
      return;
    }

    if (file.size > maxSizeBytes) {
      onError?.(`Image size must be less than ${maxSizeMB}MB.`);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
      }
      return;
    }

    setSelectedFile(file);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      onError?.('Please select an image to upload.');
      return;
    }

    const formElement = event.target as HTMLFormElement; // Explicitly cast event.target

    const categoryValue = (formElement.category as HTMLSelectElement)?.value;
    const referenceValue = (formElement.reference as HTMLSelectElement)?.value;
    const sourceUrlValue = (formElement.sourceUrl as HTMLInputElement)?.value;
    const copyrightTypeValue = (formElement.copyrightType as HTMLSelectElement)?.value;
    const creditNameValue = (formElement.creditName as HTMLInputElement)?.value;
    const creditUrlValue = (formElement.creditUrl as HTMLInputElement)?.value;
    const dateValue = (formElement.date as HTMLInputElement)?.value;
    const defaultCaptionValue = (formElement.defaultCaption as HTMLInputElement)?.value;

    const formData = new FormData();
    formData.append('photo', selectedFile);
    formData.append('category', categoryValue);
    formData.append('reference', referenceValue);
    formData.append('sourceUrl', sourceUrlValue);
    formData.append('copyrightType', copyrightTypeValue);
    formData.append('creditName', creditNameValue);
    formData.append('creditUrl', creditUrlValue);
    formData.append('date', dateValue);
    formData.append('defaultCaption', defaultCaptionValue);
    formData.append('profileId', profileId || '');

    try {
      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        onImageUploaded?.(data.imageUrl);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        formElement.reset(); // Reset the form using the cast variable
      } else {
        const errorData = await response.json();
        onError?.(errorData.error || 'Failed to upload image.');
      }
    } catch (error: any) {
      console.error('Error during upload:', error);
      onError?.('An error occurred while uploading the image.');
    }
  };
  
  const handleCategoryChange = async (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
    setReferenceOptions([]);

    if (selectedCategory === 'person') {
      try {
        const response = await fetch('/api/people');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result);

        const persons: Person[] = result.person || [];

        const personOptions = persons
          .filter((person) => person.status === 'ok')
          .map((person) => ({
            value: person._id,
            label: '', // Label will be rendered by HandleNickName
            person: person,
          }));
        setReferenceOptions(personOptions);
      } catch (error) {
        console.error('Error fetching persons:', error);
        setReferenceOptions([{ value: '', label: 'Error loading persons' }]);
      }
    } else if (selectedCategory === 'tribe') {
      setReferenceOptions([
        { value: 'tribeB1', label: 'Tribe B1' },
        { value: 'tribeB2', label: 'Tribe B2' },
      ]);
    } else if (selectedCategory === 'garment') {
      setReferenceOptions([
        { value: 'garmentC1', label: 'Garment C1' },
        { value: 'garmentC2', label: 'Garment C2' },
        { value: 'garmentC3', label: 'Garment C3' },
        { value: 'optionC4', label: 'Option C4' },
      ]);
    } else {
      setReferenceOptions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="">&nbsp;</option>
          <option value="person">Person</option>
          <option value="tribe">Tribe</option>
          <option value="garment">Garment</option>
        </select>
      </div>
      <div>
        <label htmlFor="reference">Select Reference:</label>
        <select
          id="reference"
          disabled={referenceOptions.length === 0}
        >
          {referenceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.person ? (
                <HandleNickName person={option.person} />
              ) : (
                option.label
              )}
            </option>
          ))}
        </select>
      </div>
      <div>
          <label htmlFor="sourceUrl">SourceURL</label>
          <input type="text" id="sourceUrl" />
      </div>
      <div>
        <label htmlFor="copyrightType">Copyright</label>
        <select id="copyrightType">
          <option value="Creative Commons">Creative Commons</option>
          <option value="Public Domain">Public Domain</option>
          <option value="Purchased Stock">Stock Image</option>
        </select>
      </div>
      <div>
          <label htmlFor="creditName">Credit Name</label>
          <input type="text" id="creditName" />
      </div>
      <div>
          <label htmlFor="creditUrl">Credit URL</label>
          <input type="text" id="creditUrl" />
      </div>
      <div>
        <label htmlFor="image">Upload Image (JPG or PNG, max 2.5MB):</label>
        <input
          type="file"
          id="image"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </div>
      {selectedFile && (
        <p>Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)</p>
      )}
      <div>
        <label htmlFor="date">Photo Date</label>
        <input type="date" id="date" />
      </div>
      <div>
          <label htmlFor="defaultCaption">Default Caption</label>
          <MDEditor id="defaultCaption" />
      </div>
      <button type="submit" disabled={!selectedFile}>Upload</button>
    </form>
  );
};

export default ImageUploadForm;
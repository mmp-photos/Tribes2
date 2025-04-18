"use client";
import React, { useState, useRef } from 'react';

interface ImageUploadFormProps {
  onImageUploaded?: (file: File) => void;
  onError?: (message: string) => void;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({ onImageUploaded, onError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const formData = new FormData();
    formData.append('photo', selectedFile); // Use 'photo' as the field name for the image

    try {
      const response = await fetch('/api/photos', { // Updated API route
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        onImageUploaded?.(data.imageUrl); // Assuming your API returns imageUrl
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        onError?.(errorData.error || 'Failed to upload image.');
      }
    } catch (error: any) {
      console.error('Error during upload:', error);
      onError?.('An error occurred while uploading the image.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <button type="submit" disabled={!selectedFile}>Upload</button>
    </form>
  );
};

export default ImageUploadForm;
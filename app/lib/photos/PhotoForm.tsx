// In your page or another component:
import React, { useState } from 'react';
import ImageUploadForm from './ImageUploadForm'; // Adjust the path as needed

const PhotoForm: React.FC = () => {
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  const handleImageUploaded = (file: File) => {
    console.log('Image uploaded successfully:', file);
    setUploadStatus(`Uploaded: ${file.name}`);
    // You might want to update state to show a preview or success message
  };

  const handleUploadError = (message: string) => {
    console.error('Upload error:', message);
    setUploadStatus(`Error: ${message}`);
  };

  return (
    <div>
      <h1>Upload an Image</h1>
      <ImageUploadForm onImageUploaded={handleImageUploaded} onError={handleUploadError} />
      {uploadStatus && <p>{uploadStatus}</p>}
      <img src="/images/uploads/1744910921024-nt7p4e9.jpg" alt="Test photo"/>
    </div>
  );
};

export default PhotoForm;
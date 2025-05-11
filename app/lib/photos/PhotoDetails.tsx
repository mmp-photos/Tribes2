//PhotoDetails//
"use client";
import React, { useState, useEffect } from "react";
import { PhotoId } from "../types/photo";

interface PhotoDetailsProps {
    photoId: PhotoId; // Expecting an object with a photoId property
  }
  
const PhotoDetails: React.FC<PhotoDetailsProps> = ({ photoId }) => {
    console.log(`PhotoId passed to component is: ${photoId.photoId}`)
    const [imageId, setImageId] = useState(null)
    useEffect(() => {}, [imageId])

    return(
        <>
        <h2>{photoId.photoId}</h2>
        </>
    )
}

export default PhotoDetails;
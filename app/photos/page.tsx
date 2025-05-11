"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // Import AuthContext
import PhotoForm from "../lib/photos/PhotoForm";
import PhotoDetails from "../lib/photos/PhotoDetails";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { PhotoId } from "../lib/types/photo";

const Photos: React.FC = () => {
  const { user, token } = useAuth();
    const [photoId, setPhotoId] = useState<string | null>(null);
    const [editPhoto, setEditPhoto] = useState<boolean>(false);
    const [isAddingNew, setIsAddingNew] = useState<boolean>(false); // State for adding new
    const { setPageTitle, isAdmin } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    const pathSegments = pathname.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    const idFromQuery = searchParams.get('id');

    console.log("lastSegment:", lastSegment, typeof lastSegment);
    console.log("idFromQuery:", idFromQuery, typeof idFromQuery);

    if (lastSegment && lastSegment !== 'photo' && !isAddingNew) {
        setPhotoId(idFromQuery);
        setEditPhoto(false);
    } else if (idFromQuery && !isAddingNew) {
        setPhotoId(idFromQuery);
        setEditPhoto(false);
    } else if (!isAddingNew) {
        setPhotoId(null);
        setEditPhoto(false);
    }
  }, [pathname, searchParams, isAddingNew]);


  return (
    <main>
      {photoId ? (
          <PhotoDetails
            photoId={{ photoId: photoId }}
          />
        ) : <PhotoForm />
      }
    </main>
  );
};

export default Photos;
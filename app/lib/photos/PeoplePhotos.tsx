import React from "react";
import { AdditionalPhotosListProps, AdditionalPhotoItemProps } from "../types/photo";

const AdditionalPhotoItem: React.FC<AdditionalPhotoItemProps> = ({ photoId, caption }) => {
  return (
    <div className="additional-photo-item">
      {photoId?.fileName && typeof photoId.fileName === 'string' && (
        <>
          {/* Calculate the subfolder within a JavaScript expression */}
          {(() => {
            const subfolder = photoId.fileName.slice(0, 2);
            const imageUrl = `/images/uploads/${subfolder}/${photoId.fileName}`;
            return (
              <img
                src={imageUrl}
                alt={caption || photoId.fileName || 'Additional Photo'}
              />
            );
          })()}
        </>
      )}
      {caption ? (
        <p className="caption">{caption}</p>
      ) : photoId?.defaultCaption ? (
        <p className="caption">{photoId.defaultCaption}</p>
      ) : null}
    </div>
  );
};

const AdditionalPhotosList: React.FC<AdditionalPhotosListProps> = ({ additionalPhotos }) => {
  return (
    <div className="additional-photos-list">
      {additionalPhotos && additionalPhotos.map((item, index) => (
        <AdditionalPhotoItem key={index} photoId={item.photoId} caption={item.caption} />
      ))}
      {!additionalPhotos || additionalPhotos.length === 0 ? (
        <p>No additional photos available.</p>
      ) : null}
    </div>
  );
};

export default AdditionalPhotosList;
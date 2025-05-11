import mongoose, { Schema, Types } from 'mongoose';

const AdditionalPhotoSchema = new Schema({
    photoId: {
        type: Types.ObjectId,
        ref: 'Photo',
        required: true
    },
    caption: {
        type: String
    },
    altText: {
        type: String,
        required: true
    },
    fileName: {
        type: String
    },
    url: {
        type: String,
    },
    creditName: {
        type: String
    },
    creditUrl: {
        type: String
    },
    defaultCaption: {
        type: String,
        required: true
    }
}, { _id: false });

export default AdditionalPhotoSchema;
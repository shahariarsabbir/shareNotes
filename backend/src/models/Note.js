const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    semester: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },
    filePublicId: {
      type: String, // Cloudinary public ID for deletion
    },
    fileName: {
      type: String,
    },
    fileType: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    likesCount: {
      type: Number,
      default: 0,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        value: { type: Number, min: 1, max: 5 },
      },
    ],
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Text index for search
noteSchema.index({ title: 'text', description: 'text', subject: 'text', tags: 'text' });

module.exports = mongoose.model('Note', noteSchema);

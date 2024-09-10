import mongoose from 'mongoose';

const imageSchema = mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',  // Uncommented to reference the Company collection
    },
    campaignID: {
      type: mongoose.Schema.Types.ObjectId, // Changed to ObjectId for consistency
      ref: 'Campaign',  // Uncommented to reference the Campaign collection
      required: true,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    imageName: {
      type: String,
      required: true,
    },
    thumbnailName: {
      type: String,
    },
    smallName: {
      type: String,
    },
    mediumName: {
      type: String,
    },
    largeName: {
      type: String,
    },
    description: {
      type: String,
    },
    approved: {
      type: Boolean,
      required: true,
    },
    pending: {
      type: Boolean,
      required: true,
    },
    createdOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,  // Adds `createdAt` and `updatedAt` automatically
  }
);

const Image = mongoose.model('Image', imageSchema);

export default Image;

import asyncHandler from 'express-async-handler';
import Image from '../models/imagesModel.js'; 
import Campaign from '../models/campaignModel.js';
import path from 'path';
import sharp from 'sharp';
import fs from 'fs';


// @desc    Get all images
// @route   GET /api/images
// @access  Public
const getImages = asyncHandler(async (req, res) => {
  try {
    const images = await Image.find();
    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ message: 'Failed to retrieve images', error: error.message });
  }
});

const resizeAndSaveImage = async (file, sizes, timestamp) => {
  await Promise.all(sizes.map(async size => {
    const outputFilename = `${timestamp}-${size.suffix}-${file.originalname}`
    const outputPath = path.join('uploads', outputFilename);
    
    console.log(`Saving resized image: ${outputFilename}`);
    await sharp(file.path)
      .resize(size.width, size.height)
      .toFile(outputPath);
  }));
  fs.unlinkSync(file.path);
};
// @desc    Create a new image entry
// @route   POST /api/images
// @access  Private (Protected)
// @desc    Create a new image entry
// @route   POST /api/images
// @access  Private (Protected)
const createImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { campaignID } = req.body;

  if (!campaignID) {
    return res.status(400).json({ message: 'Campaign ID is required' });
  }

  try {
    // Ensure the user is authenticated
    if (!req.session.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Find the campaign by ID
    const campaign = await Campaign.findById(campaignID);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Get timestamp and prepare to process image sizes
    const timestamp = Date.now();

    // Resize and save the image in different sizes
    const sizes = [
      { width: 150, height: 150, suffix: 'thumbnail' },
      { width: 300, height: 300, suffix: 'small' },
      { width: 800, height: 750, suffix: 'medium' },
      { width: 1920, height: 1920, suffix: 'large' },
    ];

    await resizeAndSaveImage(req.file, sizes, timestamp);

    const baseName = path.parse(req.file.filename).name;
    const extension = path.parse(req.file.filename).ext.slice(1); // Extract extension without the leading dot

    // Construct image names for all sizes
    const thumbnailName = `${timestamp}-thumbnail-${req.file.originalname}`;
    const smallName = `${timestamp}-small-${req.file.originalname}`;
    const mediumName = `${timestamp}-medium-${req.file.originalname}`;
    const largeName = `${timestamp}-large-${req.file.originalname}`;

    // Create a new Image document with all sizes
    const image = new Image({
      imageName: req.file.filename,
      thumbnailName: thumbnailName,
      smallName: smallName,
      mediumName: mediumName,
      largeName: largeName,
      campaignID: campaignID,
      userID: req.session.userId,
      approved: false,
      pending: true,
    });

    await image.save();

    // Push the image ID to the campaign's images array
    campaign.images.push(image._id); // Storing the image ID in the campaign's images array
    await campaign.save();

    res.status(201).json({
      message: 'Image uploaded and added to campaign successfully',
      image,
    });
  } catch (error) {
    console.error('Error saving image:', error.message);
    res.status(500).json({ message: `Server error, failed to upload image: ${error.message}` });
  }
});



// @desc    Update an image entry
// @route   PUT /api/images/:id
// @access  Public
const updateImage = asyncHandler(async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);

    if (image) {
      image.companyId = req.body.companyId || image.companyId;
      image.campaignID = req.body.campaignID || image.campaignID;
      image.imageName = req.body.imageName || image.imageName;
      image.description = req.body.description || image.description;
      image.approved = req.body.approved !== undefined ? req.body.approved : image.approved;

      const updatedImage = await image.save();
      res.json(updatedImage);
    } else {
      res.status(404).json({ message: 'Image entry not found' });
    }
  } catch (error) {
    console.error('Error updating image entry:', error);
    res.status(500).json({ error: 'An error occurred while updating the image' });
  }
});

const approveImage = asyncHandler(async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const image = await Image.findByIdAndUpdate(imageId, { approved: true, pending: false }, { new: true });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
   // campaign.images.push(image._id);
    res.status(200).json({ message: "Image approved successfully", image });
  } catch (error) {
    console.error('Error approving image:', error);
    res.status(500).json({ message: "Error approving image" });
  }
});

const rejectImage = asyncHandler(async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const { note } = req.body;
    const image = await Image.findByIdAndUpdate(imageId, { approved: false, description: note, pending: false }, { new: true });
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ message: "Image rejected successfully", image });
  } catch (error) {
    console.error('Error rejecting image:', error);
    res.status(500).json({ message: "Error rejecting image" });
  }
});


export { getImages, createImage, updateImage, approveImage, rejectImage};

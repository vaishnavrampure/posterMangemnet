import express from 'express';
import multer from 'multer';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import {
  getImages, 
  createImage,
  updateImage,
  approveImage,
  rejectImage,
} from '../controllers/imagesController.js';
import { checkPermissions } from '../middleware/checkPermissionsMiddleware.js';


const imagesRoutes = express.Router();

// Setup Multer for image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.originalname}`;
    console.log('Saving file as:', filename); // Debugging log
    cb(null, filename);
  },
});

const upload = multer({ storage });

// Define routes
imagesRoutes.route('/')
  .get(checkPermissions(['view_all_campaigns', 'get_image']), getImages)
  .post(
    checkPermissions(['upload_images']), 
    upload.single('image'), 
    createImage
  );

imagesRoutes.post('/:imageId/approve', checkPermissions(['image_approval']), approveImage);
imagesRoutes.post('/:imageId/reject', checkPermissions(['image_approval']), rejectImage);

export default imagesRoutes;

import express from 'express';
import asyncHandler from 'express-async-handler';
import Role from '../models/roleModel.js';
import { checkPermissions } from '../middleware/checkPermissionsMiddleware.js';

const roleRoutes = express.Router();

// @desc    Get all roles
// @route   GET /api/roles
// @access  Public
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({});
  res.json(roles);
});

roleRoutes.get('/', getRoles);

export default roleRoutes;

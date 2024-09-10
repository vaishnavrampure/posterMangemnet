import express from 'express';
import { setupRolesAndPermissions } from '../utils/setup.js';

const setupRoutes = express.Router();

setupRoutes.post('/', async (req, res) => {
  try {
    //console.log('Request Body:', req.body); 
    const userConfig = req.body;
    const result = await setupRolesAndPermissions(userConfig);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Username is there or you ran into something else' });
  }
});

export default setupRoutes;
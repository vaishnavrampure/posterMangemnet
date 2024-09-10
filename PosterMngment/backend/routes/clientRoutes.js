import express from 'express';
import {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient,
    putCampaign,
} from '../controllers/clientController.js';
import { isAuthenticated } from '../middleware/authMiddleware.js'; 
import { checkPermissions } from '../middleware/checkPermissionsMiddleware.js';

const clientRouter = express.Router();

clientRouter.post('/', isAuthenticated,checkPermissions(['manage_client_companies']), createClient);          
clientRouter.get('/', isAuthenticated, getClients);             
clientRouter.get('/:id', isAuthenticated, getClientById);       
clientRouter.put('/:id', isAuthenticated,checkPermissions(['manage_client_companies']), updateClient);        
clientRouter.delete('/:id', isAuthenticated,checkPermissions(['manage_client_companies']), deleteClient);    
clientRouter.put('/:clientId/add-campaign',checkPermissions(['manage_campaigns']), isAuthenticated, putCampaign); 

export default clientRouter;

import express from 'express';
import {
    createCampaign,
    getAllCampaigns,
    getCampaignById,
    updateCampaign,
    deleteCampaign,
    getCampaignsByRole,
    getStatus,
} from '../controllers/campaignController.js'
import { protect} from '../middleware/authMiddleware.js';
import { checkPermissions } from '../middleware/checkPermissionsMiddleware.js';
import Campaign from '../models/campaignModel.js';
import { generateReport } from '../utils/reportGenerator.js';
const campaignRoutes = express.Router();

campaignRoutes.post(
    '/',
    protect,
    checkPermissions(['manage_campaigns']),
    createCampaign
);

campaignRoutes.put(
    '/:id',
    protect,
    checkPermissions(['manage_campaigns']),
    updateCampaign
);

campaignRoutes.delete(
    '/:id',
    protect,
    checkPermissions(['manage_campaigns']),
    deleteCampaign
);

campaignRoutes.get(
    '/',
    protect,
    checkPermissions(['view_all_campaigns', 'get_campaigns']),
    getAllCampaigns
);
campaignRoutes.get('/status', checkPermissions(['manage_campaigns']), getStatus); 
campaignRoutes.get('/role', protect,  checkPermissions(['manage_campaigns', 'view_all_campaigns', 'view_client_campaigns', 'view_contractor_campaigns']), getCampaignsByRole);
campaignRoutes.get('/:id', protect, checkPermissions(['view_all_campaigns', 'view_contractor_campaigns', 'view_client_campaigns']), getCampaignById);
campaignRoutes.get('/:id/report', async (req, res) => {
    try {
        console.log(req.params.id)
        const campaign = await Campaign.findById(req.params.id);
        console.log(campaign);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const now = new Date();
        const twoWeeksAfterCompletion = new Date(campaign.completionDate);
        twoWeeksAfterCompletion.setDate(twoWeeksAfterCompletion.getDate() + 14);

        if (now < campaign.completionDate || now > twoWeeksAfterCompletion) {
            return res.status(403).json({ message: 'Report not available' });
        }

        const pdfBuffer = await generateReport(campaign);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="report-${campaign.name}.pdf"`);
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default campaignRoutes;

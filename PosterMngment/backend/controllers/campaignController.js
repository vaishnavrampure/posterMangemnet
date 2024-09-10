import Campaign from '../models/campaignModel.js';
import Client from '../models/clientModel.js';

// POST: Create a new campaign
// POST: Create a new campaign
export const createCampaign = async (req, res) => {
    const { name, assignedContractors, clientName, email, address } = req.body;

    // Validate required fields 
    if (!name || !assignedContractors || !clientName) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        const client = await Client.findById(clientName);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const newCampaign = new Campaign({
            name,
            assignedContractors,
            clientName: client.name,
            active: client.active, // Inherit the active status from the client
            createdBy: req.user._id, // Track who created the campaign
            status: 'In Progress', // Default status for new campaigns
            email,
            address, // Include address object
        });

        await newCampaign.save();
        res.status(201).json(newCampaign);
    } catch (error) {
        console.error("Failed to create campaign:", error);
        res.status(500).json({ message: "Failed to create campaign", error: error.message });
    }
};

// GET: Fetch all campaigns
// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Private
export const getAllCampaigns = (async (req, res) => {
    try {
        const campaigns = await Campaign.find({});
        res.status(200).json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error.message);
        res.status(500).json({ message: 'Failed to fetch campaigns', error: error.message });
    }
});

// GET: Fetch campaigns by role
export const getCampaignsByRole = async (req, res) => {
    try {
        let campaigns;
        if (req.user.roles.includes('Contractor')) {
            campaigns = await Campaign.find({ 
                assignedContractors: req.user._id,
                status: { $in: ['In Progress'] },
                active: true // Ensure only active campaigns are retrieved
            });
        } else if (req.user.roles.includes('Client')) {
            campaigns = await Campaign.find({ clientName: req.user.clientName, active: true });
        } else if (req.user.roles.includes('Employee')) {
            campaigns = await Campaign.find({});
        } else {
            return res.status(403).json({ message: 'Unauthorized access' });
        }
        res.status(200).json(campaigns);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Fetch a single campaign by ID
export const getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id).populate('images');
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Update a campaign
export const updateCampaign = async (req, res) => {
    const { id } = req.params;
    const { name, status, images, lastModifiedBy, assignedContractors, clientName, active, city, neighborhood, postersOrContacts, type, quotedRate} = req.body;  // Include active in the destructuring

    console.log(req.body)

    // Validate required fields
    if (clientName === undefined || clientName === null) {
        return res.status(400).json({ message: "clientName is required and cannot be null" });
    }

    try {
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const client = await Client.findOne({ name: clientName });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Update campaign fields
        campaign.name = name !== undefined ? name : campaign.name;
        campaign.status = status !== undefined ? status : campaign.status;
        campaign.images = images !== undefined ? images : campaign.images;
        campaign.assignedContractors = assignedContractors !== undefined ? assignedContractors : campaign.assignedContractors;
        campaign.clientName = clientName !== undefined ? clientName : campaign.clientName;
        campaign.lastModifiedBy = lastModifiedBy || req.user._id;
        campaign.lastModifiedDate = Date.now();
        campaign.city = city;
        campaign.neighborhood = neighborhood;
        campaign.postersOrContacts = postersOrContacts
        campaign.type = type;
        campaign.quotedRate = quotedRate;

        // Ensure the campaign's active status is either provided or matches the client's status
        campaign.active = active !== undefined ? active : client.active;

        // Update completion date if status is completed
        if (campaign.status === 'Completed' && !campaign.completionDate) {
            campaign.completionDate = Date.now();
        }

        await campaign.save();
        res.status(200).json(campaign);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};


// GET: Get campaign statuses
export const getStatus = async (req, res) => {
    const statuses = Campaign.schema.path('status').enumValues;
    res.status(200).json(statuses);
};

// DELETE: Delete a campaign
export const deleteCampaign = async (req, res) => {
    const { id } = req.params;
    try {
        const campaign = await Campaign.findByIdAndDelete(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

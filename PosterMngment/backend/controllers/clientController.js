import Client from '../models/clientModel.js';
import Campaign from '../models/campaignModel.js';

// POST: Create a new client
export const createClient = async (req, res) => {
    try {
        const { name, active, contactInfo, address } = req.body;

        const newClient = new Client({
            name,
            active: active !== undefined ? active : true, // Default to true if not provided
            contactInfo,
            address,
        });

        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Retrieve all clients
export const getClients = async (req, res) => {
    try {
        const clients = await Client.find().populate('campaigns');
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET: Retrieve a single client by ID
export const getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id).populate('campaigns');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Update a client
export const updateClient = async (req, res) => {
    const { id } = req.params;
    const { name, active, contactInfo, address, size} = req.body;

  //  console.log(req.body)

    try {
        const client = await Client.findById(id);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        client.name = name !== undefined ? name : client.name;
        client.active = active !== undefined ? active : client.active;
        client.contactInfo = contactInfo !== undefined ? contactInfo : client.contactInfo;
        client.address = address !== undefined ? address : client.address;
        client.size = size !== undefined ? size: client.size;

        await client.save();

        res.status(200).json(client);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
};

// DELETE: Delete a client by ID
export const deleteClient = async (req, res) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);

        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }

        // Optionally, delete or deactivate associated campaigns
        await Campaign.updateMany(
            { _id: { $in: deletedClient.campaigns } },
            { active: false } // Or use deleteMany() to delete them
        );

        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT: Assign campaigns to clients
export const putCampaign = async (req, res) => {
    const { campaignIds } = req.body;

    try {
        const clients = await Client.find();
        if (!clients || clients.length === 0) {
            return res.status(404).json({ message: 'No clients found' });
        }
        for (let campaignId of campaignIds) {
            const campaign = await Campaign.findById(campaignId);

            if (!campaign) {
                continue;
            }
            const client = clients.find(client => client.name === campaign.clientName);
            if (!client || !client.active) { // Ensure only active clients can have campaigns assigned
                continue;
            }
            for (let otherClient of clients) {
                if (otherClient._id.equals(client._id)) {
                    continue;
                }
                const index = otherClient.campaigns.indexOf(campaignId);
                if (index !== -1) {
                    otherClient.campaigns.splice(index, 1);
                    await otherClient.save();
                }
            }
            if (!client.campaigns.some(existingId => existingId.equals(campaignId))) {
                client.campaigns.push(campaignId);
                await client.save();
            }
        }
        res.status(200).json({ message: 'Campaigns processed successfully' });
    } catch (error) {
        console.error('Error processing campaigns:', error);
        res.status(500).json({ message: error.message });
    }
};

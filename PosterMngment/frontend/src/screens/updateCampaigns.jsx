import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useDeleteCampaignMutation } from '../slices/campaignsApiSlice';
import { toast } from 'react-toastify';

const CampaignListScreen = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [clients, setClients] = useState([]);
  const [status, setStatus] = useState([]);

  const navigate = useNavigate();
  const [deleteCampaign] = useDeleteCampaignMutation();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch contractors');
        }
        const data = await response.json();
        const filteredContractors = data.filter(user => user.roles && user.roles.includes('Contractor'));
        setContractors(filteredContractors);
      } catch (error) {
        console.error('Error fetching contractors:', error);
      }
    };

    const fetchCampaigns = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/campaigns');
        if (!response.ok) {
          throw new Error('Failed to fetch campaigns');
        }
        const data = await response.json();
        setCampaigns(data);
      } catch (error) {
        console.error('Failed to fetch campaigns:', error);
      }
    };

    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        const activeClients = data.filter(client => client.active);
        setClients(activeClients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const getStatuses = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/campaigns/status');
        if (!response.ok) {
          throw new Error('Failed to fetch statuses');
        }
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.error('Error fetching status by role:', error);
      }
    };

    fetchContractors();
    fetchCampaigns();
    fetchClients();
    getStatuses();
  }, []);

  const deleteCampaignHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this campaign?')) {
      try {
        await deleteCampaign(id).unwrap();
        setCampaigns(campaigns.filter(c => c._id !== id));
        toast.success('Campaign deleted successfully!');
      } catch (error) {
        console.error('Error deleting campaign:', error);
        toast.error('Failed to delete campaign');
      }
    }
  };

  const editCampaignHandler = (campaign) => {
    navigate(`/campaigns/${campaign._id}/edit`, { state: { campaign } });
  };

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col></Col>
        <Col className="text-end">
          <Link to="/create-camp">
            <Button style={{ marginTop: '10px' }} variant="primary">
              Create a Campaign
            </Button>
          </Link>
        </Col>
      </Row>
      <h1>Campaigns</h1>
      <Table className="table-sm">
        <thead>
          <tr>
            <th>CAMPAIGN</th>
            <th>STATUS</th>
            <th>CONTRACTORS</th>
            <th>CLIENT NAME</th>
            <th>ACTIVE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((campaign) => (
            <tr key={campaign._id}>
              <td>{campaign.name}</td>
              <td>{campaign.status}</td>
              <td>
                {campaign.assignedContractors.map(contractorId => {
                  const contractor = contractors.find(c => c._id === contractorId);
                  return contractor ? contractor.username : 'Unknown';
                }).join(', ')}
              </td>
              <td>{campaign.clientName || 'No Client'}</td>
              <td>{campaign.active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button
                  variant="success"
                  className="me-2 btn-sm"
                  onClick={() => editCampaignHandler(campaign)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteCampaignHandler(campaign._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default CampaignListScreen;

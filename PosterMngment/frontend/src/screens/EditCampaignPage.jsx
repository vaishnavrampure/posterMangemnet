import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import { useUpdateCampaignMutation } from '../slices/campaignsApiSlice';
import { toast } from 'react-toastify';

const EditCampaignScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [campaignName, setCampaignName] = useState('');
  const [campaignStatus, setCampaignStatus] = useState('');
  const [contractors, setContractors] = useState([]);
  const [selectedContractors, setSelectedContractors] = useState([]);
  const [clientName, setClientName] = useState('');
  const [active, setActive] = useState(false);
  const [clients, setClients] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);

  // New fields
  const [city, setCity] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [postersOrContacts, setPostersOrContacts] = useState(0);
  const [type, setType] = useState('');
  const [quotedRate, setQuotedRate] = useState(0);

  const [updateCampaign] = useUpdateCampaignMutation();

  useEffect(() => {
    const campaign = location.state?.campaign;

    if (campaign) {
      setCampaignName(campaign.name);
      setCampaignStatus(campaign.status);
      setSelectedContractors(campaign.assignedContractors);
      setClientName(campaign.clientName || '');
      setActive(campaign.active);
      setCity(campaign.city || '');
      setNeighborhood(campaign.neighborhood || '');
      setPostersOrContacts(campaign.postersOrContacts || 0);
      setType(campaign.type || '');
      setQuotedRate(campaign.quotedRate || 0);
    } else {
      const fetchCampaign = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/campaigns/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch campaign');
          }
          const data = await response.json();
          setCampaignName(data.name);
          setCampaignStatus(data.status);
          setSelectedContractors(data.assignedContractors);
          setClientName(data.clientName || '');
          setActive(data.active);
          setCity(data.city || '');
          setNeighborhood(data.neighborhood || '');
          setPostersOrContacts(data.postersOrContacts || 0);
          setType(data.type || '');
          setQuotedRate(data.quotedRate || 0);
        } catch (error) {
          console.error('Error fetching campaign:', error);
        }
      };
      fetchCampaign();
    }

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

    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/clients');
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
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
        setStatusOptions(data);
      } catch (error) {
        console.error('Error fetching status by role:', error);
      }
    };

    fetchContractors();
    fetchClients();
    getStatuses();
  }, [id, location.state]);

  const handleContractorChange = (event) => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    setSelectedContractors(selectedOptions);
  };

  const saveEditHandler = async (e) => {
    e.preventDefault();
    if (!campaignName || !campaignStatus || !selectedContractors.length || !clientName || !city || !neighborhood || !type || !quotedRate) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      await updateCampaign({
        id,
        name: campaignName,
        status: campaignStatus,
        assignedContractors: selectedContractors,
        clientName,
        active,
        city,
        neighborhood,
        postersOrContacts,
        type,
        quotedRate,
      }).unwrap();

      toast.success('Campaign updated successfully!');
      navigate('/campaigns');
    } catch (error) {
      console.error('Error updating campaign:', error);
      toast.error('Failed to update campaign');
    }
  };

  return (
    <Container>
      <h1>Edit Campaign</h1>
      <Form onSubmit={saveEditHandler}>
        <Form.Group controlId="campaignName">
          <Form.Label>Campaign Name</Form.Label>
          <Form.Control
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="campaignStatus">
          <Form.Label>Campaign Status</Form.Label>
          <Form.Control
            as="select"
            value={campaignStatus}
            onChange={(e) => setCampaignStatus(e.target.value)}
          >
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="contractors">
          <Form.Label>Assigned Contractors</Form.Label>
          <Form.Control
            as="select"
            multiple
            value={selectedContractors}
            onChange={handleContractorChange}
          >
            {contractors.map(contractor => (
              <option key={contractor._id} value={contractor._id}>
                {contractor.username}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="clientName">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            as="select"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
          >
            <option value="">Select Client</option>
            {clients.map(client => (
              <option key={client._id} value={client.name}>
                {client.name}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="city">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="neighborhood">
          <Form.Label>Neighborhood</Form.Label>
          <Form.Control
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="postersOrContacts">
          <Form.Label># of Posters/Contacts</Form.Label>
          <Form.Control
            type="number"
            value={postersOrContacts}
            onChange={(e) => setPostersOrContacts(parseInt(e.target.value))}
            min="0"
          />
        </Form.Group>

        <Form.Group controlId="type">
          <Form.Label>Type</Form.Label>
          <Form.Control
            as="select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Poster">Poster</option>
            <option value="Street Work">Street Work</option>
            <option value="Flyers">Flyers</option>
            <option value="Pop-up">Pop-up</option>
          </Form.Control>
        </Form.Group>

        <Form.Group controlId="quotedRate">
          <Form.Label>Quoted Rate ($)</Form.Label>
          <Form.Control
            type="number"
            value={quotedRate}
            onChange={(e) => setQuotedRate(parseFloat(e.target.value))}
            min="0"
            step="0.01"
          />
        </Form.Group>

        <Form.Group controlId="active">
          <Form.Check
            type="checkbox"
            label="Active"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
          />
        </Form.Group>

        <Button type="submit" variant="primary" style={{ marginTop: '10px' }}>
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditCampaignScreen;

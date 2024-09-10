import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate, Link} from 'react-router-dom';

const CampaignCreationScreen = () => {
  const [campaignName, setCampaignName] = useState('');
  const userInfo = useSelector(state => state.auth.userInfo);
  const [contractors, setContractors] = useState([]);
  const [selectedContractors, setSelectedContractors] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [company, setCompany] = useState([])
  const [selectedCompany, setSelectedCompany] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !userInfo.permissions.includes('manage_campaigns')) {
      toast.error('You do not have permission to create campaigns');
      navigate('/');
      return;
    }

    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/clients');
        if (!response.ok) {
          throw new Error(`Failed to fetch clients: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        const activeClients = data.filter(client => client.active);
        setClients(activeClients);
      } catch (error) {
        toast.error('Failed to fetch clients');
        console.error('Error fetching clients:', error);
      }
    };

    const fetchContractors = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        if (!response.ok) {
          throw new Error(`Failed to fetch contractors: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data)
        const filteredContractors = data.filter(user => user.roles.some(role => role.includes('Contractor')));
        setContractors(filteredContractors);
      } catch (error) {
        toast.error('Failed to fetch contractors');
        console.error('Error fetching contractors:', error);
      }
    };
   

    fetchContractors();
    fetchClients();
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: campaignName,
          assignedContractors: selectedContractors,
          clientName: selectedClient,
          company: selectedCompany,
        }),
      });

      if (response.ok) {
        toast.success('Campaign created successfully');
        setCampaignName('');
        setSelectedContractors([]); // Reset the contractors selection
        setSelectedClient(''); // Reset the client selection
        setSelectedCompany('')
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create campaign');
      }
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Error submitting form');
    }
  };


  const handleContractorChange = (event) => {
    const selectedOptions = Array.from(event.target.options)
      .filter(option => option.selected)
      .map(option => option.value);
    setSelectedContractors(selectedOptions);
  };
  const handleClientChange = (event) => {
    setSelectedClient(event.target.value);
  };
  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
  };

  return (
    <Container>
      <Col className="text-end">
          <Link to="/create-client">
            <Button style={{ marginTop: '10px' }} variant="primary">Create a Client</Button>
          </Link>
        </Col>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1>Create a New Campaign</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='campaignName'>
              <Form.Label>Campaign Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter campaign name'
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </Form.Group>

            {contractors.length > 0 && (
              <Form.Group controlId='contractorSelect'>
                <Form.Label>Assign Contractors</Form.Label>
                <Form.Control
                  as='select'
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
            )}
            <Form.Group controlId='clientSelect'>
              <Form.Label>Select Client</Form.Label>
              <Form.Control
                as='select'
                value={selectedClient}
                onChange={handleClientChange}
              >
                <option value="">Choose a client...</option>
                {clients.map(client => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          
            <Button variant='primary' type='submit' style={{ marginTop: '10px' }}>
              Create Campaign
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CampaignCreationScreen;

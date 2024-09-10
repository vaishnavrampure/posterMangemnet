import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { toast } from 'react-toastify';

const EditClientScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState('');
  const [clientActive, setClientActive] = useState(false);
  const [clientFullName, setClientFullName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientStreet, setClientStreet] = useState('');
  const [clientCity, setClientCity] = useState('');
  const [clientState, setClientState] = useState('');
  const [clientZipCode, setClientZipCode] = useState('');
  const [size, setSize] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch client');
        }
        const data = await response.json();
        setClientName(data.name);
        setClientActive(data.active);
        setClientFullName(data.contactInfo?.fullName || '');
        setClientEmail(data.contactInfo?.email || '');
        setClientPhone(data.contactInfo?.phone || '');
        setClientStreet(data.address?.street || '');
        setClientCity(data.address?.city || '');
        setClientState(data.address?.state || '');
        setClientZipCode(data.address?.zipCode || '');
        setSize(data.size || 0);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch client:', error);
        setError('Failed to fetch client details');
        setLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  const saveEditHandler = async (e) => {
    e.preventDefault();
    if (!clientName) {
      toast.error('Client name cannot be empty');
      return;
    }

    const updatedClient = {
      name: clientName,
      active: clientActive,
      contactInfo: {
        fullName: clientFullName,
        email: clientEmail,
        phone: clientPhone,
      },
      address: {
        street: clientStreet,
        city: clientCity,
        state: clientState,
        zipCode: clientZipCode,
      },
      size: size,
    };
    console.log("updated", updatedClient);

    try {
      const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updatedClient),
      });

      if (!response.ok) {
        throw new Error('Failed to update client');
      }

      toast.success('Client updated successfully!');
      navigate('/clients');
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Failed to update client');
    }
  };

  if (loading) {
    return (
      <Container className="text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <h1>Edit Client</h1>
      <Form onSubmit={saveEditHandler}>
        <Form.Group controlId="clientName">
          <Form.Label>Client Name</Form.Label>
          <Form.Control
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="clientActive" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Active"
            checked={clientActive}
            onChange={(e) => setClientActive(e.target.checked)}
          />
        </Form.Group>

        <Form.Group controlId="clientFullName" className="mt-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={clientFullName}
            onChange={(e) => setClientFullName(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientEmail" className="mt-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientPhone" className="mt-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="text"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientStreet" className="mt-3">
          <Form.Label>Street</Form.Label>
          <Form.Control
            type="text"
            value={clientStreet}
            onChange={(e) => setClientStreet(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientCity" className="mt-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={clientCity}
            onChange={(e) => setClientCity(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientState" className="mt-3">
          <Form.Label>State</Form.Label>
          <Form.Control
            type="text"
            value={clientState}
            onChange={(e) => setClientState(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientZipCode" className="mt-3">
          <Form.Label>Zip Code</Form.Label>
          <Form.Control
            type="text"
            value={clientZipCode}
            onChange={(e) => setClientZipCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="clientSize" className="mt-3">
          <Form.Label>Size (Number of Employees)</Form.Label>
          <Form.Control
            type="number"
            value={size}
            onChange={(e) => setSize(parseInt(e.target.value))}
            min="0"
          />
        </Form.Group>

        <Button type="submit" variant="primary" className="mt-3">
          Save Changes
        </Button>
      </Form>
    </Container>
  );
};

export default EditClientScreen;

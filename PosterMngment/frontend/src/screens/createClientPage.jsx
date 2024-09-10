import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateClientPage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        toast.success('Client created successfully');
        navigate('/create-client'); // Redirect to the clients list or another relevant page
        setName()
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to create client');
      }
    } catch (error) {
      console.error('Error creating client:', error);
      toast.error('Failed to create client');
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Create Client</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="name" className="mb-3">
              <Form.Label>Client Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter client name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Create Client
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateClientPage;

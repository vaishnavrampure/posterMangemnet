import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

const UpdateClients = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clients', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch clients');
        }
        const data = await response.json();
        setClients(data);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };

    fetchClients();
  }, []);

  const deleteClientHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/clients/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setClients(clients.filter(client => client._id !== id));
          toast.success('Client deleted successfully!');
        } else {
          toast.error('Failed to delete client');
        }
      } catch (error) {
        console.error('Error deleting client:', error);
        toast.error('Failed to delete client');
      }
    }
  };

  const editClientHandler = (id) => {
    navigate(`/clients/${id}/edit`); // Navigate to EditClientScreen
  };

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col></Col>
        <Col className="text-end">
          <Link to="/create-client">
            <Button style={{ marginTop: '10px' }} variant="primary">Create a Client</Button>
          </Link>
        </Col>
      </Row>
      <h1>Clients</h1>
      <Table className="table-sm">
        <thead>
          <tr>
            <th>CLIENT NAME</th>
            <th>ACTIVE</th>
            <th>ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client._id}>
              <td>{client.name}</td>
              <td>{client.active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button
                  variant="success"
                  className="me-2 btn-sm"
                  onClick={() => editClientHandler(client._id)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="btn-sm"
                  onClick={() => deleteClientHandler(client._id)}
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

export default UpdateClients;

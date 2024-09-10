import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';

const EditUserScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('');
  const [roles, setRoles] = useState([]);
  const [clientName, setClientName] = useState('');
  const [active, setActive] = useState(false);
  const [clients, setClients] = useState([]);
  const availableRoles = ['Employee', 'Contractor', 'Client'];

  useEffect(() => {
    const user = location.state?.user;

    if (user) {
      // Use the data passed from UserListScreen
      setUsername(user.username);
      setRoles(user.roles);
      setClientName(user.clientName || '');
      setActive(user.active);
    } else {
      // If no data is passed, fetch the user data
      const fetchUser = async () => {
        try {
          const response = await fetch(`http://localhost:3000/api/users/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch user');
          }
          const data = await response.json();
          setUsername(data.username);
          setRoles(data.roles);
          setClientName(data.clientName || '');
          setActive(data.active);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }

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

    fetchClients();
  }, [id, location.state]);

  const saveEditHandler = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        username,
        roles,
        active,
      };

      if (roles.includes('Client') || roles.includes('Contractor')) {
        payload.clientName = clientName;
      } else {
        payload.clientName = '';
      }

      const response = await fetch(`http://localhost:3000/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to update user');
      }

      navigate('/update'); // Redirect to user list after saving
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleRoleChange = (e) => {
    const { options } = e.target;
    const selectedRoles = [];
    for (const option of options) {
      if (option.selected) {
        selectedRoles.push(option.value);
      }
    }
    setRoles(selectedRoles);
  };

  return (
    <Container>
      <h1>Edit User</h1>
      <Form onSubmit={saveEditHandler}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="roles">
          <Form.Label>Roles</Form.Label>
          <Form.Control as="select" value={roles} onChange={handleRoleChange} multiple>
            {availableRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Form.Control>
        </Form.Group>

        {(roles.includes('Client') || roles.includes('Contractor')) && (
          <Form.Group controlId="clientName">
            <Form.Label>Client Name</Form.Label>
            <Form.Control
              as="select"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client.name}>
                  {client.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        )}

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

export default EditUserScreen;

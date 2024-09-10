import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Table, Button, Container, Row, Col } from 'react-bootstrap';
import { useDeleteUserMutation } from '../slices/usersApiSlice';

const UserListScreen = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users');
      if (!response.ok) {
        throw new Error('Response is not ok');
      }
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
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

  useEffect(() => {
    fetchUsers();
    fetchClients();
  }, []);

  const [deleteUser] = useDeleteUserMutation();

  useEffect(() => {
    if (!userInfo || !userInfo.roles.includes('Employee')) {
      navigate('/login');
    }
  }, [navigate, userInfo]);

  const deleteUserHandler = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteUser(id).unwrap();
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const editUserHandler = (user) => {
    navigate(`/users/${user._id}/edit`, { state: { user } });
  };

  return (
    <Container>
      <Row className="align-items-center mb-4">
        <Col></Col>
        <Col className="text-end">
          <Link to="/create-user">
            <Button style={{ marginTop: '10px' }} variant="primary">
              Create a User
            </Button>
          </Link>
        </Col>
      </Row>
      <h1>Users</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table className="table-sm">
          <thead>
            <tr>
              <th>USERNAME</th>
              <th>ROLES</th>
              <th>CLIENT NAME</th>
              <th>STATUS</th>
              <th>Edit or Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.roles.join(', ')}</td>
                <td>{user.clientName || ''}</td>
                <td>{user.active ? 'Active' : 'Inactive'}</td>
                <td>
                  <Button
                    style={{ marginRight: '10px' }}
                    variant="success"
                    className="btn-sm"
                    onClick={() => editUserHandler(user)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    className="btn-sm"
                    onClick={() => deleteUserHandler(user._id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default UserListScreen;

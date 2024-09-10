import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Container, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import { toast } from 'react-toastify';

const SignupScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    uppercase: false,
    specialChar: false,
  });

  const passwordRef = useRef(null);

  const passwordRegex = {
    length: /.{16,}/,
    uppercase: /[A-Z]/,
    specialChar: /[@$!%*?&]/,
  };

  useEffect(() => {
    const fetchRoles = async () => {
      const response = await fetch('http://localhost:5000/api/roles');
      const data = await response.json();
      setRoles(data);
    };

    fetchRoles();
  }, []);

  const validatePassword = (password) => {
    setPasswordCriteria({
      length: passwordRegex.length.test(password),
      uppercase: passwordRegex.uppercase.test(password),
      specialChar: passwordRegex.specialChar.test(password),
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { length, uppercase, specialChar } = passwordCriteria;
    if (!(length && uppercase && specialChar)) {
      toast.error('Password does not meet all criteria.');
      return;
    }

    const response = await fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, confirmPassword, role: selectedRole }),
    });

    if (response.ok) {
      toast.success(`${username} has been registered`);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setSelectedRole('');
      setPasswordCriteria({
        length: false,
        uppercase: false,
        specialChar: false,
      });
    } else {
      const error = await response.json();
      toast.error(error.message);
    }
  };

  const popover = (
    <Popover id="password-popover">
      <Popover.Body>
        <ul>
          <li style={{ color: passwordCriteria.length ? 'green' : 'red' }}>
            At least 16 characters long
          </li>
          <li style={{ color: passwordCriteria.uppercase ? 'green' : 'red' }}>
            At least one uppercase letter
          </li>
          <li style={{ color: passwordCriteria.specialChar ? 'green' : 'red' }}>
            At least one special character (@, $, !, %, *, ?, &)
          </li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1>Create New User</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='username'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId='password'>
              <Form.Label>Password</Form.Label>
              <OverlayTrigger
                trigger="focus"
                placement="right"
                overlay={popover}
              >
                <Form.Control
                  ref={passwordRef}
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                ></Form.Control>
              </OverlayTrigger>
            </Form.Group>

            <Form.Group controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm Password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>


            <div style={{ marginTop: '10px' }}>
              <Button type='submit' variant='primary'>
                Register
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupScreen;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch(); // used to send off actions to redux
    const navigate = useNavigate();

    const [login] = useLoginMutation();

    const { userInfo } = useSelector((state) => state.auth);

    {
        useEffect(() => {
            if (userInfo) {
                navigate('/');
            }
        }, [navigate, userInfo]);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const res = await login({ username, password }).unwrap();
            dispatch(setCredentials({ ...res }));
            navigate('/');
            toast.success("You have been logged in");
        } catch (err) {
            toast.error(err?.data?.message || err.error);
        }
    };

    return (
        <FormContainer>
            <h2 style={{textAlign: 'center'}}>PosterPulse Services</h2>
            <Form onSubmit={submitHandler}>
                <Form.Group className='my-2' controlId='username'>
                    <Form.Label>Username </Form.Label>
                    <Form.Control
                        type='username'
                        placeholder='Enter username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    ></Form.Control>
                </Form.Group>
                <Form.Group className='my-2' controlId='password'>
                    <Form.Label>Password </Form.Label>
                    <Form.Control
                        type='password'
                        placeholder='Enter password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    >

                    </Form.Control>
                </Form.Group>
                <Button
                    type='submit'
                    variant="primary"
                    className="mt-3"
                >
                    Log in
                </Button>
            </Form>
        </FormContainer>
    )


}
export default LoginScreen;
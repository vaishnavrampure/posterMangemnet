import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Row, Col, Button } from 'react-bootstrap';
import ImagePoster from '../components/imagePoster';
import { Link } from 'react-router-dom';

const HomeScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const styles = {
    container: {
      marginTop: '48px',
    },
    rowCenter: {
      justifyContent: 'center',
    },
    welcomeText: {
      marginBottom: '16px',
    },
    leadText: {
      fontSize: '20px',
    },
    imagePosterRow: {
      marginTop: '32px',
    },
    welcomeHeader: {
      marginBottom: '32px',
    },
  };

  return (
    <Container style={styles.container}>
      {userInfo ? (
        <>
          <Row style={styles.rowCenter}>
            <Col md={8} className="text-center">
              <h1 style={styles.welcomeText}>Welcome, {userInfo.username}!</h1>
              <p style={styles.leadText}>
                You are logged in as a <strong>{userInfo.roles}</strong>.
              </p>
            </Col>
          </Row>
          <Row style={styles.imagePosterRow}>
            <Col md={12}>
              <ImagePoster />
            </Col>
          </Row>
        </>
      ) : (
        <Row style={{ ...styles.rowCenter, textAlign: 'center' }}>
          <Col md={8}>
            <h1 style={styles.welcomeHeader}>Welcome to PosterPulse</h1>
            <Link to="/login">Login</Link> or <Link to="/signup">Sign up</Link>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default HomeScreen;

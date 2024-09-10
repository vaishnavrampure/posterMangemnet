import { Navbar, Nav, Container, Tab } from 'react-bootstrap';
import { FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../slices/authSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      // Handle error (optional)
    }
  };

  const navLinkStyle = {
    color: '#fff', 
    backgroundColor: 'transparent',
  };

  return (
    <header>
      <Navbar style={{ backgroundColor: '#4784d7' }} variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">PosterPulse</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Tab.Container defaultActiveKey="home">
              <Nav className="ms-auto">
                <Nav.Item>
                  <LinkContainer to="/">
                    <Nav.Link eventKey="home" style={navLinkStyle}>
                      Home
                    </Nav.Link>
                  </LinkContainer>
                </Nav.Item>
                {userInfo && (
                  <>
                    {userInfo.permissions.includes("manage_users") && (
                      <>
                        <Nav.Item>
                          <LinkContainer to="/update">
                            <Nav.Link eventKey="update-user" style={navLinkStyle}>
                              Update User
                            </Nav.Link>
                          </LinkContainer>
                        </Nav.Item>
                      </>
                    )}
                    {userInfo.permissions.includes("manage_campaigns") && (
                      <>
                        <Nav.Item>
                          <LinkContainer to="/update-camp">
                            <Nav.Link eventKey="update-campaign" style={navLinkStyle}>
                              Update Campaign
                            </Nav.Link>
                          </LinkContainer>
                        </Nav.Item>
                      </>
                    )}
                    {userInfo.permissions.includes("manage_client_companies") && (
                      <>
                        <Nav.Item>
                          <LinkContainer to="/update-clients">
                            <Nav.Link eventKey="update-clients" style={navLinkStyle}>
                              Update Clients
                            </Nav.Link>
                          </LinkContainer>
                        </Nav.Item>
                      </>
                    )}
                    {userInfo.permissions.includes("upload_images") && (
                      <Nav.Item>
                        <LinkContainer to="/create-images">
                          <Nav.Link eventKey="upload-images" style={navLinkStyle}>
                            Upload Images
                          </Nav.Link>
                        </LinkContainer>
                      </Nav.Item>
                    )}
                    <Nav.Item>
                      <Nav.Link eventKey="logout" onClick={logoutHandler} style={navLinkStyle}>
                        <FaSignOutAlt /> Logout
                      </Nav.Link>
                    </Nav.Item>
                  </>
                )}
                {!userInfo && (
                  <>
                    <Nav.Item>
                      <LinkContainer to="/login">
                        <Nav.Link eventKey="login" style={navLinkStyle}>
                          <FaSignInAlt /> Sign In
                        </Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                    <Nav.Item>
                      <LinkContainer to="/signup">
                        <Nav.Link eventKey="signup" style={navLinkStyle}>
                          <FaSignInAlt /> Sign Up
                        </Nav.Link>
                      </LinkContainer>
                    </Nav.Item>
                  </>
                )}
              </Nav>
            </Tab.Container>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

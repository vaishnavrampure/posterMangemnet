import { Container, Row, Col} from 'react-bootstrap';


const FormContainer = ({children}) => {
  return (
    <Container>
        <Row className = 'justify-content-lg-center mt-5 mb-3'>
            <Col xs={12} md={6} className='card p-5'>
                {children}
            </Col>
        </Row>
    </Container>
)}

export default FormContainer;
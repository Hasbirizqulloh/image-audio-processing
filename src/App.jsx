import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavbarComponent from './components/NavbarComponent';
import AudioCompress from './components/AudioCompress';
import ImageConverter from './components/ImageConverter';

function App() {
  return (
    <>
      <NavbarComponent />
      <Container className="my-5">
        <Row className="justify-content-md-center">
          <Col xs lg="5" className="text-center">
            <AudioCompress />
          </Col>
          <Col xs lg="5" className="text-center">
            <ImageConverter />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;

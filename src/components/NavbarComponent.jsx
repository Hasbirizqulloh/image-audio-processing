import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

const NavbarComponent = () => {
  return (
    <Navbar className="nav">
      <Container>
        <Navbar.Brand className="text-white">IMAGE AND AUDIO PROCESSING</Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;

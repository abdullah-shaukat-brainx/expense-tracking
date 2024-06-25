import React from 'react';
import { useLocation } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function TopNavbar() {
  const location = useLocation();

  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Navbar.Brand href="/dashboard" >Expense Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/expense" active={location.pathname === '/expense'}>Expenses</Nav.Link>
            <Nav.Link href="/category" active={location.pathname === '/category'}>Categories</Nav.Link>
            <Nav.Link href="/budget" active={location.pathname === '/budget'}>Budgets</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link href="/users/update_profile" active={location.pathname === '/users/update_profile'}>Update Profile</Nav.Link>
            <Nav.Link
              onClick={() => {
                localStorage.clear();
              }}
              className="success"
              href="/users/login"
            >
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNavbar;

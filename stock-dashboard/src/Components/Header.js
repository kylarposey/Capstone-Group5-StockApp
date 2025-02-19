import React from 'react';
//import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

//import { Navbar, Nav, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom'; // Import Link


function Header() {
   return (
      <nav>
         <Link to="/" className='title'>Stock App</Link>
         <ul>
            {/* <li>
               <Link to="/">Stock App</Link>
            </li> */}
            <li>
               <Link to="/about">About</Link>
            </li>
            <li>
               <Link to="/login">Login</Link>
            </li>
            <li>
               <Link to="/register">Register</Link>
            </li>
         </ul>
      </nav>
      /* {/* <Navbar className="header" expand="lg">
         <Navbar.Brand as={Link} to="/">Stock App</Navbar.Brand>
         <Navbar.Toggle aria-controls="basic-navbar-nav" />
         <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"> 
               <Nav.Link as={Link} to="/about">About</Nav.Link>
            </Nav>
            <Nav className="ml-auto"> 
               <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </Nav>
            <Nav className="ml-auto"> 
               <Button variant="outline-primary" as={Link} to="/register">
                  Register
               </Button>
            </Nav>
         </Navbar.Collapse>
      </Navbar> */
   );

}

export default Header;
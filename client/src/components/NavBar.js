import { useState, } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useNavigate, Link, NavLink } from "react-router-dom";
import { useAuth } from '../hook/useAuth';
import {observer} from "mobx-react-lite";


const NavBar = observer( () => {
  const {logout, isAuth, checkAuth} = useAuth();
     
  const navigate = useNavigate();

  const logOut = () => {
    //setAuth(false);
    logout();
    navigate('/'); 
  }
  

  return (
    <Navbar bg="dark" variant={"dark"} expand="md">
      <Container >
        <Navbar.Brand href="#">
          <img
            src = 'logo192.png'
            height='30'
            width = '30'
            alt="user pic"
          />
          Прогноз погоды  
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="navbarScroll_123" />
        <Navbar.Collapse id="navbarScroll_123">

          <Nav className="me-auto" >
            <Nav.Link as={NavLink} to="/">Home</Nav.Link>
            <Nav.Link as={NavLink} to="/service">Сервис</Nav.Link>
      
            <Offcanvas.Title id={`offcanvasNavbarLabel`} style={{color: 'white'}}>
                  <hr />
            </Offcanvas.Title> 
            
          </Nav>
          
          {isAuth ?
            <Nav  className="fw-bold" style={{color: 'white'}}>
                <Button
                  variant={"outline-light"}
                  onClick={() => logOut()}
                  className="ml-2"
                >
                  Выйти
                </Button>

            </Nav>
            :
            <Nav className="fw-bold" style={{color: 'white'}}>
                <Nav.Link as={NavLink} to="/registration">Регистрация</Nav.Link>
                <Nav.Link as={NavLink} to="/login">Логин</Nav.Link>
            </Nav>
          }
           
        </Navbar.Collapse>
        

      </Container>
    </Navbar>
  );
}
)

export {NavBar};

// src/components/navbar/NavBar.jsx
import React, { useState } from "react";
import { Navbar, Nav, Form, FormControl, Button, Container } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = ({ onToggleSidebar }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Buscando:", searchTerm);
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" fixed="top" className="w-100">
            <Container fluid className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <Button variant="outline-light" onClick={onToggleSidebar} className="me-2">
                        <FaBars />
                    </Button>
                    <Navbar.Brand href="/">MyTube</Navbar.Brand>
                </div>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="d-flex justify-content-between">
                    <Form className="d-flex flex-grow-1 me-3" onSubmit={handleSearchSubmit}>
                        <FormControl
                            type="search"
                            placeholder="Buscar videos..."
                            className="me-2"
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                        <Button type="submit" variant="outline-light">Buscar</Button>
                    </Form>
                    <Button variant="outline-light" onClick={handleLoginClick} className="ms-2">
                        Iniciar sesión
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;

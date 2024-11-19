// src/components/navbar/NavBar.jsx
import React, { useState, useEffect } from "react";
import { Navbar, Form, FormControl, Button, Container, Collapse } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const NavBar = ({ onToggleSidebar }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado de autenticación
    const [openProfileMenu, setOpenProfileMenu] = useState(false); // Controlar collapse del perfil
    const navigate = useNavigate();

    useEffect(() => {
        // Comprobar si el token está presente al cargar el componente
        const token = localStorage.getItem("authToken");
        console.log("Llego hasta aca")
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Buscando:", searchTerm);
    };

    const handleLoginClick = () => {
        // Redirigir a la página de login
        navigate("/login");
    };

    const handleLogout = () => {
        // Eliminar el token de localStorage y cambiar el estado de autenticación
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        navigate("/");  // Redirige a la página principal
    };

    const handleProfileClick = () => {
        navigate("/profile"); // Redirige al perfil del usuario
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

                    {/* Mostrar botón de Login o Perfil según el estado de autenticación */}
                    {isAuthenticated ? (
                        <div className="position-relative">
                            <Button
                                variant="outline-light"
                                onClick={() => setOpenProfileMenu(!openProfileMenu)}
                            >
                                Perfil
                            </Button>
                            {/* Collapse o menú de perfil que se extiende por encima del navbar */}
                            <Collapse in={openProfileMenu}>
                                <div
                                    className="position-absolute mt-2"
                                    style={{
                                        top: '100%',
                                        right: '0',
                                        zIndex: 1050, // Asegura que esté sobre el navbar
                                        backgroundColor: '#343a40',
                                        borderRadius: '5px',
                                        width: '200px'
                                    }}
                                >
                                    <Button
                                        variant="outline-light"
                                        onClick={handleProfileClick}
                                        className="d-block w-100 text-start p-2"
                                    >
                                        Visitar perfil
                                    </Button>
                                    <Button
                                        variant="outline-light"
                                        onClick={handleLogout}
                                        className="d-block w-100 text-start p-2"
                                    >
                                        Cerrar sesión
                                    </Button>
                                </div>
                            </Collapse>
                        </div>
                    ) : (
                        <Button variant="outline-light" onClick={handleLoginClick} className="ms-2">
                            Iniciar sesión
                        </Button>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavBar;
// src/components/canales/ChannelPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import axiosInstance from "../axiosinstance";
import { useNavigate } from "react-router-dom";
import "./ChannelPage.css";

const ChannelPage = () => {
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchChannels();
    }, []);

    // Obtener todos los canales
    const fetchChannels = async () => {
        try {
            const response = await axiosInstance.get("/channels/active");
            setChannels(response.data);
        } catch (err) {
            setError("Error al cargar los canales. Inténtalo de nuevo.");
        }
    };

    // Ordenar los canales por suscriptores
    const sortChannels = (order) => {
        const sortedChannels = [...channels].sort((a, b) => {
            return order === "asc"
                ? a.subscribersCount - b.subscribersCount
                : b.subscribersCount - a.subscribersCount;
        });
        setChannels(sortedChannels);
        setSortOrder(order);
    };

    // Buscar canales por nombre
    const handleSearch = async (event) => {
        event.preventDefault();
        if (searchQuery.trim() === "") {
            fetchChannels();
            return;
        }
        try {
            const response = await axiosInstance.get(`/search?name=${searchQuery}`);
            setChannels(response.data);
        } catch (err) {
            setError("Error al buscar canales. Inténtalo de nuevo.");
        }
    };

    // Navegar a la página de detalles del canal
    const handleChannelClick = (channelId) => {
        navigate(`/channels/${channelId}`);
    };

    return (
        <Container className="my-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-start">Canales</h2>
                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Ordenar por suscriptores
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={() => sortChannels("asc")}>
                            De menor a mayor
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => sortChannels("desc")}>
                            De mayor a menor
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Barra de búsqueda */}
            <Form onSubmit={handleSearch} className="mb-4">
                <InputGroup>
                    <Form.Control
                        type="text"
                        placeholder="Buscar canales por nombre"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="primary" type="submit">
                        Buscar
                    </Button>
                </InputGroup>
            </Form>

            {error && <p className="text-danger text-center">{error}</p>}
            <Row>
                {channels.map((channel) => (
                    <Col key={channel._id} xs={12} md={4} className="mb-4">
                        <Button
                            variant="light"
                            className="w-100 text-start channel-button"
                            onClick={() => handleChannelClick(channel._id)}
                        >
                            <h5 className="mb-1">{channel.channelName}</h5>
                            <p className="mb-1">{channel.channelDescription || "No hay descripción disponible."}</p>
                            <p className="mb-0"><strong>Suscriptores:</strong> {channel.subscribersCount}</p>
                        </Button>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ChannelPage;

// src/components/canales/ChannelPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import axiosInstance from "../axiosinstance"; // Ruta corregida
import "./ChannelPage.css";

const ChannelPage = () => {
    const [channels, setChannels] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchChannels = async () => {
            try {
                const response = await axiosInstance.get("/channels");
                setChannels(response.data);
            } catch (err) {
                setError("Error al cargar los canales. Inténtalo de nuevo.");
            }
        };

        fetchChannels();
    }, []);

    return (
        <Container className="my-4">
            <h2 className="text-start mb-4">Canales</h2>
            {error && <p className="text-danger text-center">{error}</p>}
            <Row>
                {channels.map((channel) => (
                    <Col key={channel._id} xs={12} md={4} className="mb-4">
                        <Button variant="light" className="w-100 text-start channel-button">
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

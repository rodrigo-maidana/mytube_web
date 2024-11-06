// src/components/canales/ChannelDetailPage.jsx
import React, { useEffect, useState } from "react";
import { Container, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosinstance"; // Asegura que esté bien ubicado

const ChannelDetailPage = () => {
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [videos, setVideos] = useState({});
    const [subscribers, setSubscribers] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetchChannelDetails();
        fetchPlaylists();
    }, [channelId]);

    // Función para cargar la información del canal
    const fetchChannelDetails = async () => {
        try {
            const response = await axiosInstance.get(`/channels/${channelId}`);
            setChannel(response.data);
            setSubscribers(response.data.subscribersCount);
        } catch (error) {
            console.error("Error al obtener detalles del canal:", error);
        }
    };

    // Cargar las playlists asociadas al canal
    const fetchPlaylists = async () => {
        try {
            const response = await axiosInstance.get(`/playlists`);
            const channelPlaylists = response.data.filter(
                (playlist) => playlist.channel.id === parseInt(channelId)
            );
            setPlaylists(channelPlaylists);

            // Para cada playlist, cargar sus videos
            channelPlaylists.forEach((playlist) =>
                fetchPlaylistVideos(playlist.id)
            );
        } catch (error) {
            console.error("Error al obtener las playlists:", error);
        }
    };

    // Cargar videos específicos de una playlist
    const fetchPlaylistVideos = async (playlistId) => {
        try {
            const response = await axiosInstance.get(`/playlist_videos`);
            const playlistVideos = response.data.filter(
                (video) => video.playlist.id === playlistId
            );
            setVideos((prevVideos) => ({
                ...prevVideos,
                [playlistId]: playlistVideos,
            }));
        } catch (error) {
            console.error("Error al obtener los videos de la playlist:", error);
        }
    };

    // Suscribirse o desuscribirse del canal
    const handleSubscribe = async () => {
        try {
            if (isSubscribed) {
                await axiosInstance.post(`/subscriptions/unsubscribe`, {
                    userId: 1, // Esto debería ser dinámico según el usuario actual
                    channelId,
                });
                setSubscribers((prev) => prev - 1);
            } else {
                await axiosInstance.post(`/subscriptions/subscribe`, {
                    userId: 1, // Ajusta con el ID real del usuario logueado
                    channelId,
                });
                setSubscribers((prev) => prev + 1);
            }
            setIsSubscribed(!isSubscribed);
        } catch (error) {
            console.error("Error al cambiar la suscripción:", error);
        }
    };

    if (!channel) return <p>Cargando...</p>;

    return (
        <Container className="my-4">
            <h2>{channel.channelName}</h2>
            <p>{channel.channelDescription}</p>
            <Button variant={isSubscribed ? "secondary" : "primary"} onClick={handleSubscribe}>
                {isSubscribed ? "Desuscribirse" : "Suscribirse"}
            </Button>
            <p className="mt-2"><strong>Suscriptores:</strong> {subscribers}</p>

            <h3 className="mt-4">Playlists</h3>
            <ListGroup className="mb-4">
                {playlists.map((playlist) => (
                    <ListGroup.Item key={playlist.id}>
                        <h5>{playlist.playlistName}</h5>
                        <p>Visibilidad: {playlist.visibility}</p>
                        <Row>
                            {videos[playlist.id]?.map((video) => (
                                <Col key={video.id} xs={12} md={6} lg={4} className="mb-3">
                                    <div className="video-card">
                                        <img src={video.thumbnailUrl} alt={video.title} className="img-fluid" />
                                        <h6>{video.title}</h6>
                                        <p>{video.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Container>
    );
};

export default ChannelDetailPage;

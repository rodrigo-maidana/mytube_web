// src/components/canales/ChannelDetailPage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosinstance";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./ChannelDetailPage.css";

const ChannelDetailPage = () => {
    const { channelId } = useParams();
    const [channel, setChannel] = useState(null);
    const [playlists, setPlaylists] = useState([]);
    const [videos, setVideos] = useState([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchChannel();
        fetchPlaylists();
        fetchVideos(0); // Cargar la primera página de videos
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [channelId]);

    // Obtener detalles del canal
    const fetchChannel = async () => {
        try {
            const response = await axiosInstance.get(`/channels/${channelId}`);
            setChannel(response.data);
        } catch (err) {
            setError("Error al obtener el canal. Inténtalo de nuevo.");
        }
    };

    // Obtener playlists del canal
    const fetchPlaylists = async () => {
        try {
            const response = await axiosInstance.get(`/playlists?channelId=${channelId}`);
            setPlaylists(response.data);
        } catch (err) {
            setError("Error al obtener las playlists. Inténtalo de nuevo.");
        }
    };

    // Obtener videos del canal, según la página
    const fetchVideos = async (pageNumber) => {
        try {
            const response = await axiosInstance.get(`/videos?channelId=${channelId}&page=${pageNumber}`);
            const newVideos = response.data.filter(video => video.channelId === parseInt(channelId)); // Filtrar videos por channelId

            if (newVideos.length > 0) {
                setVideos((prevVideos) => [...prevVideos, ...newVideos]);
            } else {
                setHasMore(false); // No hay más videos para cargar
            }
        } catch (err) {
            setError("Error al obtener los videos. Inténtalo de nuevo.");
        }
    };

    // Manejar el scroll para cargar más videos
    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && hasMore) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        if (page > 0) fetchVideos(page);
    }, [page]);

    // Suscribirse al canal
    const handleSubscribe = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                setError("Por favor, inicia sesión para suscribirte.");
                return;
            }

            const response = await axiosInstance.post("/subscriptions/save", {
                userId: parseInt(userId, 10),
                channelId: parseInt(channelId, 10),
            });

            if (response.status === 201) {
                alert("Te has suscrito al canal con éxito.");
            }
        } catch (err) {
            setError("Error al suscribirse al canal. Inténtalo de nuevo.");
        }
    };

    return (
        <Container className="channel-detail-page">
            {error && <p className="text-danger text-center">{error}</p>}
            {channel && (
                <>
                    <div className="channel-header d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h1 className="channel-name">{channel.channelName}</h1>
                            <p className="channel-description">{channel.channelDescription}</p>
                        </div>
                        <Button variant="primary" className="subscribe-button" onClick={handleSubscribe}>
                            Suscribirse
                        </Button>
                    </div>
                    <p className="channel-subscribers"><strong>Suscriptores:</strong> {channel.subscribersCount}</p>

                    {/* Sección de Playlists */}
                    <div className="playlists-section mt-4">
                        <h2>Listas de Reproducción</h2>
                        <Row>
                            {playlists.map((playlist) => (
                                <Col key={playlist.id} xs={12} md={6} lg={4} className="mb-3">
                                    <div className="playlist-card">
                                        <h5>{playlist.playlistName}</h5>
                                        <p>Visibilidad: {playlist.visibility}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </div>

                    {/* Sección de Videos */}
                    <div className="videos-section mt-4">
                        <h2>Videos</h2>
                        <Row>
                            {videos.map((video) => (
                                <Col key={video._id} xs={12} md={6} lg={4} className="mb-3">
                                    <div className="video-card">
                                        <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
                                        <h5 className="video-title">{video.title}</h5>
                                        <p className="video-description">{video.description}</p>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                        {hasMore && <p className="text-center">Cargando más videos...</p>}
                    </div>
                </>
            )}
        </Container>
    );
};

export default ChannelDetailPage;

// src/components/HomePage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosinstance';
import VideoCard from './VideoCard';
import './HomePage.css';

const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        // Cargar la primera página al montar el componente
        loadVideos(0);

        // Agregar el event listener para el scroll infinito
        window.addEventListener('scroll', handleScroll);

        // Limpiar el event listener al desmontar el componente
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (page > 0) {
            loadVideos(page);
        }
    }, [page]);

    const loadVideos = (pageNumber) => {
        setLoading(true);
        axiosInstance.get(`videos?page=${pageNumber}`)
            .then(response => {
                const newVideos = response.data;
                if (newVideos.length > 0) {
                    setVideos(prevVideos => [...prevVideos, ...newVideos]);
                } else {
                    setHasMore(false); // No hay más videos para cargar
                }
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al obtener los videos:', error);
                setLoading(false);
            });
    };

    const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
            setPage(prevPage => prevPage + 1); // Cargar la siguiente página
        }
    };

    return (
        <div className="homepage">
            <h1>Bienvenido a MyTube</h1>
            <div className="video-grid">
                {videos.map(video => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
            {loading && <p>Cargando...</p>}
        </div>
    );
};

export default HomePage;

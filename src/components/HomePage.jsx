// src/components/HomePage.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from './axiosinstance';
import VideoCard from './VideoCard';
import './HomePage.css';

const HomePage = () => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        axiosInstance.get('videos')
            .then(response => {
                setVideos(response.data);
            })
            .catch(error => {
                console.error('Error al obtener los videos:', error);
            });
    }, []);

    return (
        <div className="homepage">
            <h1>Bienvenido a MyTube</h1>
            <div className="video-grid">
                {videos.map(video => (
                    <VideoCard key={video.id} video={video} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;

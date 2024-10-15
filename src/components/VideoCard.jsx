// src/components/VideoCard.jsx
import React from 'react';
import './VideoCard.css';

const VideoCard = ({ video }) => {
    return (
        <div className="video-card">
            <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
            <div className="video-info">
                <h4 className="video-title">{video.title}</h4>
                <p className="video-description">{video.description}</p>
            </div>
        </div>
    );
};

export default VideoCard;

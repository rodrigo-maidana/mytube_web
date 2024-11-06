// src/components/VideoCard.jsx
import './VideoCard.css';

const VideoCard = ({ video }) => {
    return (
        <div className="video-card">
            <div className="video-info">
                <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
                    <img src={video.thumbnailUrl} alt={video.title} className="thumbnail" />
                    <h4 className="video-title">{video.title}</h4>
                </a>
            </div>
        </div>
    );
};

export default VideoCard;

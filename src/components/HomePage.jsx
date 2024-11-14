// src/components/HomePage.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "./axiosinstance";
import VideoCard from "./VideoCard";
import "./HomePage.css";

const HomePage = () => {
  const [videos, setVideos] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadVideos(0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page > 0) loadVideos(page);
  }, [page]);

  // Cargar videos de la página especificada
  const loadVideos = (pageNumber) => {
    setLoading(true);
    axiosInstance
      .get(`/videos?page=${pageNumber}`)
      .then((response) => {
        const newVideos = response.data;
        if (newVideos.length > 0) {
          setVideos((prevVideos) => [...prevVideos, ...newVideos]);
        } else {
          setHasMore(false);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los videos:", error);
        setLoading(false);
      });
  };

  // Manejar scroll para cargar más videos cuando se acerca al final de la página
  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 &&
      !loading &&
      hasMore
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 mt-5">Bienvenido a MyTube</h1>
      <div className="row">
        {videos.map((video) => (
          <div
            key={video._id}
            className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
          >
            <VideoCard video={video} />
          </div>
        ))}
      </div>
      {loading && <p className="text-center">Cargando...</p>}
    </div>
  );
};

export default HomePage;

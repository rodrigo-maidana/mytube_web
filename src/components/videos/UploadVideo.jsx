import React, { useState } from "react";
import { Button, Form, Modal, Alert } from "react-bootstrap";
import axiosInstance from "../axiosinstance";

const UploadVideo = ({ channelId, onHide }) => {
    const [newVideo, setNewVideo] = useState({
        title: "",
        description: "",
        videoUrl: "",
        thumbnailUrl: "",
        tags: "",
        visibility: "PUBLIC",
        duration: 0, // La duración será siempre 0 por defecto
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Maneja los cambios en los inputs
    const handleNewVideoChange = (e) => {
        const { name, value } = e.target;
        setNewVideo({
            ...newVideo,
            [name]: value,
        });
    };

    // Maneja el envío del formulario
    const handleUploadVideo = async () => {
        try {
            if (!channelId) {
                setError("El ID del canal no es válido.");
                return;
            }

            // Crea el objeto para la solicitud POST
            const videoData = {
                ...newVideo,
                channelId, // Incluimos el ID del canal asociado
            };

            await axiosInstance.post(`/videos/${channelId}`, videoData);
            setSuccess("Video subido con éxito.");
            setError("");
            setNewVideo({
                title: "",
                description: "",
                videoUrl: "",
                thumbnailUrl: "", // Puede ser null
                tags: "",
                visibility: "PUBLIC",
                duration: 0,
            });
            onHide(); // Cierra el modal
        } catch (err) {
            setError("Error al subir el video. Por favor, inténtalo de nuevo.");
            setSuccess("");
        }
    };

    return (
        <Modal show onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Subir Video</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}
                <Form>
                    <Form.Group controlId="videoTitle">
                        <Form.Label>Título del Video</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={newVideo.title}
                            onChange={handleNewVideoChange}
                            placeholder="Ingresa el título del video"
                        />
                    </Form.Group>
                    <Form.Group controlId="videoDescription" className="mt-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="description"
                            value={newVideo.description}
                            onChange={handleNewVideoChange}
                            placeholder="Describe el contenido del video"
                        />
                    </Form.Group>
                    <Form.Group controlId="videoUrl" className="mt-3">
                        <Form.Label>URL del Video</Form.Label>
                        <Form.Control
                            type="text"
                            name="videoUrl"
                            value={newVideo.videoUrl}
                            onChange={handleNewVideoChange}
                            placeholder="Ingresa la URL del video"
                        />
                    </Form.Group>
                    <Form.Group controlId="thumbnailUrl" className="mt-3">
                        <Form.Label>URL del Thumbnail (opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="thumbnailUrl"
                            value={newVideo.thumbnailUrl}
                            onChange={handleNewVideoChange}
                            placeholder="Ingresa la URL del thumbnail"
                        />
                    </Form.Group>
                    <Form.Group controlId="videoTags" className="mt-3">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                            type="text"
                            name="tags"
                            value={newVideo.tags}
                            onChange={handleNewVideoChange}
                            placeholder="Ingresa las etiquetas del video (separadas por comas)"
                        />
                    </Form.Group>
                    <Form.Group controlId="videoVisibility" className="mt-3">
                        <Form.Label>Visibilidad</Form.Label>
                        <Form.Select
                            name="visibility"
                            value={newVideo.visibility}
                            onChange={handleNewVideoChange}
                        >
                            <option value="PUBLIC">Público</option>
                            <option value="PRIVATE">Privado</option>
                            <option value="UNLISTED">No listado</option>
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleUploadVideo}>
                    Subir Video
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UploadVideo;

import React, { useState, useEffect } from "react";
import { Container, Button, Modal, Form, Table, Toast, ToastContainer } from "react-bootstrap";
import axiosInstance from "../axiosinstance";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const PlaylistCrudPage = () => {
    const [playlists, setPlaylists] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState("create"); // "create" or "edit"
    const [currentPlaylist, setCurrentPlaylist] = useState({ playlistName: "", visibility: "PUBLIC" });
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false); // Control para mostrar el toast
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Modal de confirmación
    const [playlistToDelete, setPlaylistToDelete] = useState(null); // ID de la playlist a eliminar

    useEffect(() => {
        fetchPlaylists();
    }, []);

    // Obtener playlists
    const fetchPlaylists = async () => {
        try {
            const response = await axiosInstance.get("/playlists");
            setPlaylists(response.data);
        } catch (error) {
            setError("Error al obtener las playlists.");
            setShowToast(true);
        }
    };

    // Manejar la visualización del modal
    const handleShowModal = (type, playlist = null) => {
        setModalType(type);
        setCurrentPlaylist(playlist || { playlistName: "", visibility: "PUBLIC" });
        setShowModal(true);
    };

    // Manejar el cierre del modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentPlaylist({ playlistName: "", visibility: "PUBLIC" });
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        setCurrentPlaylist({ ...currentPlaylist, [e.target.name]: e.target.value });
    };

    // Crear playlist
    const handleCreatePlaylist = async () => {
        try {
            await axiosInstance.post("/playlists", currentPlaylist);
            fetchPlaylists();
            handleCloseModal();
        } catch (error) {
            setError("Error al crear la playlist.");
            setShowToast(true);
        }
    };

    // Editar playlist
    const handleEditPlaylist = async () => {
        try {
            await axiosInstance.put(`/playlists/${currentPlaylist.id}`, currentPlaylist);
            fetchPlaylists();
            handleCloseModal();
        } catch (error) {
            setError("Error al editar la playlist.");
            setShowToast(true);
        }
    };

    // Confirmar eliminación
    const confirmDeletePlaylist = (id) => {
        setPlaylistToDelete(id);
        setShowConfirmModal(true);
    };

    // Eliminar playlist
    const handleDeletePlaylist = async () => {
        try {
            await axiosInstance.delete(`/playlists/${playlistToDelete}`);
            fetchPlaylists();
            setShowConfirmModal(false);
        } catch (error) {
            setError("Error al eliminar la playlist.");
            setShowToast(true);
        }
    };

    return (
        <Container className="mt-4">
            <h2>CRUD Playlists</h2>
            <Button onClick={() => handleShowModal("create")} variant="primary" className="mb-3">
                <FaPlus /> Crear Playlist
            </Button>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Visibilidad</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {playlists.map((playlist) => (
                    <tr key={playlist.id}>
                        <td>{playlist.playlistName}</td>
                        <td>{playlist.visibility}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleShowModal("edit", playlist)}>
                                <FaEdit />
                            </Button>{" "}
                            <Button variant="danger" onClick={() => confirmDeletePlaylist(playlist.id)}>
                                <FaTrashAlt />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Modal para Crear/Editar Playlist */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === "create" ? "Crear Playlist" : "Editar Playlist"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="playlistName">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="playlistName"
                                value={currentPlaylist.playlistName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="visibility" className="mt-3">
                            <Form.Label>Visibilidad</Form.Label>
                            <Form.Control
                                as="select"
                                name="visibility"
                                value={currentPlaylist.visibility}
                                onChange={handleChange}
                            >
                                <option value="PUBLIC">Público</option>
                                <option value="PRIVATE">Privado</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={modalType === "create" ? handleCreatePlaylist : handleEditPlaylist}>
                        {modalType === "create" ? "Crear" : "Guardar Cambios"}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación para eliminar */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar esta playlist?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeletePlaylist}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Toast para mostrar errores */}
            <ToastContainer position="top-end" className="p-3">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide bg="danger">
                    <Toast.Body className="text-white">{error}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
};

export default PlaylistCrudPage;

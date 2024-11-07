import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Toast, ToastContainer } from 'react-bootstrap';
import axiosInstance from '../axiosinstance';

const ChannelAdminPage = () => {
    const [channels, setChannels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [currentChannel, setCurrentChannel] = useState({ channelName: '', channelDescription: '' });
    const [error, setError] = useState('');
    const [showToast, setShowToast] = useState(false); // Control para mostrar el toast
    const [showConfirmModal, setShowConfirmModal] = useState(false); // Control del modal de confirmación
    const [channelToDelete, setChannelToDelete] = useState(null); // Canal que se va a eliminar

    useEffect(() => {
        fetchChannels();
    }, []);

    // Obtener canales
    const fetchChannels = async () => {
        try {
            const response = await axiosInstance.get('/channels');
            setChannels(response.data);
        } catch (err) {
            setError('Error al obtener los canales.');
            setShowToast(true); // Muestra el toast en caso de error
        }
    };

    // Crear o actualizar canal
    const saveChannel = async () => {
        try {
            if (modalType === 'create') {
                await axiosInstance.post('/channels', currentChannel);
            } else {
                await axiosInstance.put(`/channels/${currentChannel._id}`, currentChannel);
            }
            fetchChannels();
            setShowModal(false);
        } catch (err) {
            setError('Error al guardar el canal.');
            setShowToast(true); // Muestra el toast en caso de error
        }
    };

    // Abrir modal para crear un canal
    const handleCreateChannel = () => {
        setCurrentChannel({ channelName: '', channelDescription: '' });
        setModalType('create');
        setShowModal(true);
    };

    // Abrir modal para editar canal
    const handleEditChannel = (channel) => {
        setCurrentChannel(channel);
        setModalType('edit');
        setShowModal(true);
    };

    // Confirmación antes de eliminar
    const confirmDeleteChannel = (channelId) => {
        setChannelToDelete(channelId);
        setShowConfirmModal(true); // Muestra el modal de confirmación
    };

    // Eliminar canal
    const handleDeleteChannel = async () => {
        try {
            await axiosInstance.delete(`/channels/${channelToDelete}`);
            fetchChannels();
            setShowConfirmModal(false); // Cierra el modal de confirmación
        } catch (err) {
            setError('Error al eliminar el canal.');
            setShowToast(true); // Muestra el toast en caso de error
        }
    };

    return (
        <div>
            <h2>Administración de Canales</h2>

            <Button variant="primary" onClick={handleCreateChannel}>Crear Canal</Button>

            <Table striped bordered hover className="mt-4">
                <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                {channels.map(channel => (
                    <tr key={channel._id}>
                        <td>{channel.channelName}</td>
                        <td>{channel.channelDescription}</td>
                        <td>
                            <Button variant="warning" onClick={() => handleEditChannel(channel)}>Editar</Button>{' '}
                            <Button variant="danger" onClick={() => confirmDeleteChannel(channel._id)}>Eliminar</Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {/* Modal para crear/editar canal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{modalType === 'create' ? 'Crear Canal' : 'Editar Canal'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="channelName">
                            <Form.Label>Nombre del Canal</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentChannel.channelName}
                                onChange={(e) => setCurrentChannel({ ...currentChannel, channelName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="channelDescription" className="mt-3">
                            <Form.Label>Descripción del Canal</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={currentChannel.channelDescription}
                                onChange={(e) => setCurrentChannel({ ...currentChannel, channelDescription: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={saveChannel}>
                        {modalType === 'create' ? 'Crear' : 'Guardar'}
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal de confirmación de eliminación */}
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    ¿Estás seguro de que deseas eliminar este canal?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleDeleteChannel}>
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
        </div>
    );
};

export default ChannelAdminPage;

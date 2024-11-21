import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Table, Toast, ToastContainer } from 'react-bootstrap';
import axiosInstance from '../axiosinstance';
import { jwtDecode } from 'jwt-decode';

const ChannelAdminPage = () => {
    const [channels, setChannels] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
    const [currentChannel, setCurrentChannel] = useState({ channelName: '', channelDescription: '', userId: '', creationDate: '', channelUrl: '', subscribersCount: 0 });
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
            handleError('Error al obtener los canales.');
        }
    };

    // Crear canal (POST)
    const createChannel = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            handleError('No se encontró token de autenticación.');
            return;
        }

        try {
            // Obtener el userId desde el token
            const decodedToken = jwtDecode(token);
            const email = decodedToken.sub;

            const userIdResponse = await axiosInstance.get(`/users/search-by-email?email=${email}`);
            const userId = userIdResponse.data;

            if (!userId) {
                handleError('Usuario no encontrado.');
                return;
            }

            const newChannel = {
                ...currentChannel,
                userId,
                creationDate: new Date().toISOString(),
                channelUrl: `https://mytube.com/${currentChannel.channelName}`,
                subscribersCount: 0,
            };

            await axiosInstance.post('/channels', newChannel);
            fetchChannels();
            setShowModal(false); // Cerramos el modal
        } catch (err) {
            handleError('Error al crear el canal.');
        }
    };

    // Editar canal (PUT)
    const updateChannel = async () => {
        if (!currentChannel._id) {
            handleError('ID del canal no encontrado.');
            return;
        }

        try {
            const {
                _id,
                userId,
                channelName,
                channelDescription,
                creationDate,
                channelUrl,
                subscribersCount,
            } = currentChannel;

            // Construir el objeto para la actualización
            const updatedChannelData = {
                userId,
                channelName,
                channelDescription,
                creationDate,
                channelUrl,
                subscribersCount,
            };

            // Realizar la solicitud PUT para actualizar todos los datos del canal
            const response = await axiosInstance.put(`/channels/${_id}`, updatedChannelData);

            if (response.status === 200) {
                // Actualizar la lista de canales
                fetchChannels();
                setShowModal(false); // Cerrar el modal en caso de éxito
            } else {
                handleError('Error al editar el canal.');
            }
        } catch (err) {
            handleError('Error al editar el canal.');
        }
    };

    // Abrir modal para crear un canal
    const handleCreateChannel = () => {
        setCurrentChannel({ channelName: '', channelDescription: '', userId: '', creationDate: '', channelUrl: '', subscribersCount: 0 });
        setModalType('create');
        setShowModal(true);
    };

    // Abrir modal para editar canal
    const handleEditChannel = (channel) => {
        setCurrentChannel({
            _id: channel._id,
            userId: channel.userId,
            channelName: channel.channelName,
            channelDescription: channel.channelDescription,
            creationDate: channel.creationDate,
            channelUrl: channel.channelUrl,
            subscribersCount: channel.subscribersCount,
        });
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
            handleError('Error al eliminar el canal.');
        }
    };

    // Manejo de errores
    const handleError = (message) => {
        setError(message);
        setShowToast(true);
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
                                disabled={modalType === 'edit'} // Deshabilita la edición del nombre en el modo 'edit'
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
                    <Button
                        variant="primary"
                        onClick={modalType === 'create' ? createChannel : updateChannel}
                    >
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

import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Container, ListGroup, Modal } from 'react-bootstrap';
import axiosInstance from '../axiosinstance';
import {jwtDecode} from 'jwt-decode';

const ProfileForm = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    registrationDate: '',
    avatarUrl: '',
    bio: '',
    birthdate: '',
  });
  const [editForm, setEditForm] = useState({
    bio: '',
    avatarUrl: '',
    birthdate: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userId, setUserId] = useState(null);
  const [channels, setChannels] = useState([]); // Estado para los canales
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [currentChannel, setCurrentChannel] = useState({
    _id: '',
    channelName: '',
    channelDescription: '',
    creationDate: '',
    channelUrl: '',
    subscribersCount: 0,
    userId: '',
  });
  const [newChannel, setNewChannel] = useState({
    channelName: '',
    channelDescription: '',
  });

  // Obtener el userId usando el email del token JWT
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No se encontró token de autenticación.');
          return;
        }

        const decodedToken = jwtDecode(token);
        const email = decodedToken.sub;

        const response = await axiosInstance.get(`/users/search-by-email?email=${email}`);
        if (response.data) {
          setUserId(response.data);
        } else {
          setError('Usuario no encontrado.');
        }
      } catch (err) {
        setError('Error al obtener el userId.');
      }
    };

    fetchUserId();
  }, []);

  // Obtener los datos del perfil cuando tengamos el userId
  useEffect(() => {
    if (!userId) return;

    const fetchProfileData = async () => {
      try {
        const profileResponse = await axiosInstance.get(`/users/profile/${userId}`);
        setProfile({
          username: profileResponse.data.username,
          email: profileResponse.data.email,
          avatarUrl: profileResponse.data.avatarUrl || '',
          bio: profileResponse.data.bio || '',
          birthdate: profileResponse.data.birthdate || '',
          registrationDate: profileResponse.data.registrationDate,
        });

        setEditForm({
          bio: profileResponse.data.bio || '',
          avatarUrl: profileResponse.data.avatarUrl || '',
          birthdate: profileResponse.data.birthdate || '',
        });

        // Obtener los canales del usuario
        const channelsResponse = await axiosInstance.get(`/channels/users/${userId}`);
        setChannels(channelsResponse.data);
      } catch (error) {
        setError('Error al obtener los datos del perfil');
      }
    };

    fetchProfileData();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
  };

  const handleChannelChange = (e) => {
    const { name, value } = e.target;
    setCurrentChannel({
      ...currentChannel,
      [name]: value,
    });
  };

  const handleNewChannelChange = (e) => {
    const { name, value } = e.target;
    setNewChannel({
      ...newChannel,
      [name]: value,
    });
  };

  const handleChannelSubmit = async () => {
    try {
      const updatedChannelData = {
        userId: currentChannel.userId,
        channelName: currentChannel.channelName,
        channelDescription: currentChannel.channelDescription,
        creationDate: currentChannel.creationDate,
        channelUrl: currentChannel.channelUrl,
        subscribersCount: currentChannel.subscribersCount,
      };

      await axiosInstance.put(`/channels/${currentChannel._id}`, updatedChannelData);
      window.location.reload();
    } catch (error) {
      setError('Error al editar el canal.');
    }
  };

  const handleCreateChannelSubmit = async () => {
    try {
      const newChannelData = {
        channelName: newChannel.channelName,
        channelDescription: newChannel.channelDescription,
        userId,
        creationDate: new Date().toISOString(),
        channelUrl: `https://mytube.com/${newChannel.channelName}`,
        subscribersCount: 0,
      };

      await axiosInstance.post('/channels', newChannelData);
      window.location.reload();
    } catch (error) {
      setError('Error al crear el canal.');
    }
  };

  const handleDeleteChannel = async (channelId) => {
    try {
      if (!channelId) {
        setError('El ID del canal no es válido.');
        return;
      }

      console.log(`Eliminando canal con ID: ${channelId}`);

      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('No se encontró token de autenticación. Por favor, inicia sesión nuevamente.');
        return;
      }

      // Realizamos la solicitud DELETE con el token de autenticación
      const response = await axiosInstance.delete(`/channels/${channelId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Canal eliminado con éxito');
        // Recargar la página después de eliminar exitosamente
        window.location.reload();
      } else {
        setError('Error al eliminar el canal. Código de estado inesperado.');
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(`Error al eliminar el canal: ${error.response.data.message}`);
      } else {
        setError('Error al eliminar el canal. Por favor, inténtalo de nuevo más tarde.');
      }
      console.error('Error al eliminar el canal:', error);
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      setError('El userId no está disponible.');
      return;
    }

    const updatedProfile = {
      ...profile,
      bio: editForm.bio,
      avatarUrl: editForm.avatarUrl,
      birthdate: editForm.birthdate,
    };

    try {
      const response = await axiosInstance.put(`/users/${userId}`, updatedProfile);

      if (response.status === 200 || response.status === 201) {
        setSuccess('Perfil actualizado con éxito');
        setError('');
        setProfile(updatedProfile);
        setIsEditing(false);
      } else {
        setError('Error al actualizar el perfil');
        setSuccess('');
      }
    } catch (error) {
      setError('Error en la conexión con el servidor');
      setSuccess('');
    }
  };

  return (
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '100%', maxWidth: '700px' }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Perfil</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">{success}</Alert>}

            <div className="d-flex justify-content-center mb-4">
              <img
                  src={profile.avatarUrl || "https://static.vecteezy.com/system/resources/previews/020/911/739/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"}
                  alt="Avatar"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #fff',
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                    marginBottom: '10px',
                  }}
              />
            </div>

            {isEditing ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBirthdate">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control
                        type="date"
                        name="birthdate"
                        value={editForm.birthdate}
                        onChange={handleChange}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBio">
                    <Form.Label>Biografía</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="bio"
                        value={editForm.bio}
                        onChange={handleChange}
                        rows={3}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formAvatarUrl">
                    <Form.Label>URL del Avatar</Form.Label>
                    <Form.Control
                        type="text"
                        name="avatarUrl"
                        value={editForm.avatarUrl}
                        onChange={handleChange}
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={() => setIsEditing(false)} className="me-2">
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Guardar
                    </Button>
                  </div>
                </Form>
            ) : (
                <div className="space-y-4">
                  <p><strong>Nombre de Usuario:</strong> {profile.username}</p>
                  <p><strong>Correo Electrónico:</strong> {profile.email}</p>
                  <p><strong>Fecha de Registro:</strong> {profile.registrationDate}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {profile.birthdate || 'No establecida'}</p>
                  <p><strong>Biografía:</strong> {profile.bio || 'No establecida'}</p>

                  <Button variant="link" className="p-0" onClick={() => setIsEditing(true)}>
                    Editar Perfil
                  </Button>

                  <div className="mt-4">
                    <h5>Canales Asociados:</h5>
                    <Button
                        variant="primary"
                        className="mb-3"
                        onClick={() => setShowCreateChannelModal(true)}
                    >
                      Crear Canal
                    </Button>
                    {channels.length > 0 ? (
                        <ListGroup>
                          {channels.map((channel) => (
                              <ListGroup.Item key={channel._id} className="d-flex justify-content-between align-items-center">
                                <div>
                                  <strong>{channel.channelName}</strong> - {channel.channelDescription}
                                </div>
                                <div>
                                  <Button
                                      variant="warning"
                                      size="sm"
                                      className="me-2"
                                      onClick={() => {
                                        setCurrentChannel(channel);
                                        setShowChannelModal(true);
                                      }}
                                  >
                                    Editar
                                  </Button>
                                  <Button
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleDeleteChannel(channel._id)}
                                  >
                                    Eliminar
                                  </Button>
                                </div>
                              </ListGroup.Item>
                          ))}
                        </ListGroup>
                    ) : (
                        <p>No tienes canales asociados.</p>
                    )}
                  </div>
                </div>
            )}
          </Card.Body>
        </Card>

        {/* Modal para crear canal */}
        <Modal show={showCreateChannelModal} onHide={() => setShowCreateChannelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Crear Canal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="newChannelName">
                <Form.Label>Nombre del Canal</Form.Label>
                <Form.Control
                    type="text"
                    name="channelName"
                    value={newChannel.channelName}
                    onChange={handleNewChannelChange}
                />
              </Form.Group>
              <Form.Group controlId="newChannelDescription" className="mt-3">
                <Form.Label>Descripción del Canal</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="channelDescription"
                    value={newChannel.channelDescription}
                    onChange={handleNewChannelChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCreateChannelModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateChannelSubmit}>
              Crear
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal para editar canal */}
        <Modal show={showChannelModal} onHide={() => setShowChannelModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Canal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="channelName">
                <Form.Label>Nombre del Canal</Form.Label>
                <Form.Control
                    type="text"
                    name="channelName"
                    value={currentChannel.channelName}
                    onChange={handleChannelChange}
                    disabled // Deshabilita la edición del nombre del canal
                />
              </Form.Group>
              <Form.Group controlId="channelDescription" className="mt-3">
                <Form.Label>Descripción del Canal</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={3}
                    name="channelDescription"
                    value={currentChannel.channelDescription}
                    onChange={handleChannelChange}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowChannelModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleChannelSubmit}>
              Guardar
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
};

export default ProfileForm;

import React, { useState, useEffect } from 'react';
import { Button, Form, Card, Alert, Container, ListGroup } from 'react-bootstrap';
import axiosInstance from '../axiosinstance';
import { jwtDecode } from 'jwt-decode';  // Importamos jwt-decode para decodificar el token

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

  // Obtener el userId usando el email del token JWT
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('No se encontró token de autenticación.');
          return;
        }

        const decodedToken = jwtDecode(token); // Decodificamos el token
        const email = decodedToken.sub; // Extraemos el email del token (campo 'sub')

        // Realizamos la solicitud GET para obtener el userId usando el email
        const response = await axiosInstance.get(`/users/search-by-email?email=${email}`);
        console.log('Respuesta del servidor al buscar el userId:', response); // Log de la respuesta

        if (response.data) {
          setUserId(response.data); // Directamente guardamos el userId
          console.log('userId obtenido:', response.data); // Verifica que el userId se obtiene correctamente
        } else {
          setError('Usuario no encontrado.');
        }
      } catch (err) {
        setError('Error al obtener el userId.');
        console.error('Error al obtener el userId:', err);
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

        // Pre-llenamos el formulario de edición con los datos del perfil
        setEditForm({
          bio: profileResponse.data.bio || '',
          avatarUrl: profileResponse.data.avatarUrl || '',
          birthdate: profileResponse.data.birthdate || '',
        });

        // Obtener los canales del usuario
        const channelsResponse = await axiosInstance.get(`/channels/user/${userId}`);
        setChannels(channelsResponse.data); // Guardamos los canales en el estado
      } catch (error) {
        setError('Error al obtener los datos del perfil');
        console.error('Error al obtener los datos del perfil:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar si el userId es undefined
    if (!userId) {
      setError('El userId no está disponible.');
      return;
    }

    // Creamos el objeto de datos para la solicitud PUT
    const updatedProfile = {
      ...profile, // Mantenemos los valores originales de profile
      bio: editForm.bio,
      avatarUrl: editForm.avatarUrl,
      birthdate: editForm.birthdate,
    };

    try {
      console.log(updatedProfile);
      const response = await axiosInstance.put(`/users/${userId}`, updatedProfile);

      if (response.status === 200 || response.status === 201) {
        setSuccess('Perfil actualizado con éxito');
        setError('');
        setProfile({
          ...profile,
          bio: editForm.bio,
          avatarUrl: editForm.avatarUrl,
          birthdate: editForm.birthdate,
        });
        setIsEditing(false);
      } else {
        setError('Error al actualizar el perfil');
        setSuccess('');
      }
    } catch (error) {
      setError('Error en la conexión con el servidor');
      setSuccess('');
      console.error('Error al actualizar el perfil:', error);
    }
  };

  return (
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: '80vh' }}>
        <Card style={{ width: '100%', maxWidth: '500px' }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Perfil</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">{success}</Alert>}

            {/* Avatar circular */}
            <div className="d-flex justify-content-center mb-4">
              <img
                  src={profile.avatarUrl || "https://static.vecteezy.com/system/resources/previews/020/911/739/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"}
                  alt="Avatar"
                  style={{
                    width: '80px',  // Tamaño del avatar
                    height: '80px',
                    borderRadius: '50%',  // Hace el avatar circular
                    objectFit: 'cover',  // Asegura que la imagen se recorte correctamente si tiene dimensiones distintas
                    border: '2px solid #fff',  // Borde blanco alrededor del avatar
                    boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)', // Sombra ligera
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
                  {/* Mostrar los canales asociados al usuario */}
                  <div className="mt-4">
                    <h5>Canales Asociados:</h5>
                    {channels.length > 0 ? (
                        <ListGroup>
                          {channels.map((channel) => (
                              <ListGroup.Item key={channel._id}>
                                <strong>{channel.channelName}</strong> - {channel.channelDescription}
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
      </Container>
  );
};

export default ProfileForm;

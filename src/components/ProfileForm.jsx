// src/components/ProfileForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Container, Card, Alert } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

const ProfileForm = ({ userId }) => {
  const [profile, setProfile] = useState({
    username: "",
    registrationDate: "",
    birthdate: "",
    bio: "",
    avatarUrl: "",
  });
  const [editForm, setEditForm] = useState({
    birthdate: "",
    bio: "",
    avatarUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Obtener datos del perfil al montar el componente
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userResponse = await axiosInstance.get(
            "http://mytube.rodrigomaidana.com:8081/users/4"
        );
        const profileResponse = await axiosInstance.get(
            "http://mytube.rodrigomaidana.com:8081/profile/1"
        );

        setProfile({
          username: userResponse.data.username,
          registrationDate: profileResponse.data.registrationDate,
          birthdate: profileResponse.data.birthdate || "",
          bio: profileResponse.data.bio || "",
          avatarUrl: profileResponse.data.avatarUrl || "",
        });

        setEditForm({
          birthdate: profileResponse.data.birthdate || "",
          bio: profileResponse.data.bio || "",
          avatarUrl: profileResponse.data.avatarUrl || "",
        });
      } catch (error) {
        setError("Error al obtener los datos del perfil");
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
    try {
      const response = await axiosInstance.put(`http://mytube.rodrigomaidana.com:8083/profile/${userId}`, editForm);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Perfil actualizado con éxito");
        setError("");
        setProfile({
          ...profile,
          birthdate: editForm.birthdate,
          bio: editForm.bio,
          avatarUrl: editForm.avatarUrl,
        });
        setIsEditing(false);
      } else {
        setError("Error al actualizar el perfil");
        setSuccess("");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
      setSuccess("");
    }
  };

  return (
      <Container
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ minHeight: "80vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "500px" }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Perfil</h2>

            {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
            )}
            {success && (
                <Alert variant="success" className="text-center">
                  {success}
                </Alert>
            )}

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
                    <Button
                        variant="secondary"
                        onClick={() => setIsEditing(false)}
                        className="me-2"
                    >
                      Cancelar
                    </Button>
                    <Button variant="primary" type="submit">
                      Guardar
                    </Button>
                  </div>
                </Form>
            ) : (
                <div className="space-y-4">
                  <p>
                    <strong>Nombre de Usuario:</strong> {profile.username}
                  </p>
                  <p>
                    <strong>Fecha de Registro:</strong> {profile.registrationDate}
                  </p>
                  <p>
                    <strong>Fecha de Nacimiento:</strong> {profile.birthdate || "No establecida"}
                  </p>
                  <p>
                    <strong>Biografía:</strong> {profile.bio || "No establecida"}
                  </p>
                  <p>
                    <strong>URL del Avatar:</strong> {profile.avatarUrl || "No establecida"}
                  </p>
                  <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                </div>
            )}
          </Card.Body>
        </Card>
      </Container>
  );
};

export default ProfileForm;

// src/components/RegisterForm.jsx
import React, { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/users/save", formData);
      if (response.status === 200 || response.status === 201) {
        setSuccess("Usuario registrado con éxito");
        setError("");
        setFormData({
          username: "",
          email: "",
          password: "",
        });
      } else {
        setError("Error al registrar el usuario");
        setSuccess("");
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
      setSuccess("");
    }
  };

  return (
      <Container className="d-flex justify-content-center align-items-center mt-5" style={{ minHeight: "80vh" }}>
        <Card style={{ width: "100%", maxWidth: "500px" }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Registro de Usuario</h2>

            {error && <Alert variant="danger" className="text-center">{error}</Alert>}
            {success && <Alert variant="success" className="text-center">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUsername">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu nombre de usuario"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu email"
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Ingresa tu contraseña"
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mt-3">
                Registrar
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
  );
};

export default RegisterForm;

// src/components/login/LoginPage.jsx
import React, { useState } from "react";
import { Form, Button, Container, Card } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosinstance";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Enviar formulario de inicio de sesión
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/login", formData);
      if (response.status === 200) {
        const token = response.data.token; // Ajusta según cómo tu backend retorne el token
        localStorage.setItem("authToken", token);
        navigate("/");
      } else {
        setError("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Detalles del error: ", error);
      if (error.response) {
        // La solicitud se completó, pero el servidor respondió con un código de estado no exitoso
        console.log("1");
        setError(`Error: ${error.response.status}`);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        setError("No se recibió respuesta del servidor");
        console.log("2");
      } else {
        // Algo más causó el error
        console.log("3");
        setError("Error al intentar conectar con el servidor");
      }
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }} className="p-4">
        <Card.Body>
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
          {error && <p className="text-danger text-center">{error}</p>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Ingresa tu email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Ingresa tu contraseña"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>
              ¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginPage;

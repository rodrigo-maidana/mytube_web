import React, { useState } from "react";
import { Form, Button, Alert, Container, Card } from "react-bootstrap";
import axiosInstance from "./axiosinstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.info("Creando usuario...", { autoClose: false });

    try {
      const response = await axiosInstance.post(
          "http://mytube.rodrigomaidana.com:8081/users/save",
          formData
      );
      if (response.status === 200 || response.status === 201) {
        setSuccess("Usuario registrado con éxito");
        setError("");
        toast.update(toastId, {
          render: "Registro completado y autenticación creada",
          type: "success",
          autoClose: 5000,
        });

        setFormData({
          username: "",
          email: "",
          password: "",
        });
      } else {
        setError("Error al registrar el usuario");
        setSuccess("");
        toast.update(toastId, {
          render: "Error al registrar el usuario",
          type: "error",
          autoClose: 5000,
        });
      }
    } catch (error) {
      setError("Error en la conexión con el servidor");
      setSuccess("");
      toast.update(toastId, {
        render: "Error en la conexión con el servidor",
        type: "error",
        autoClose: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container
          className="d-flex justify-content-center align-items-center mt-5"
          style={{ minHeight: "80vh" }}
      >
        <Card style={{ width: "100%", maxWidth: "500px" }} className="p-4 shadow">
          <Card.Body>
            <h2 className="text-center mb-4">Registro de Usuario</h2>

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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
                />
              </Form.Group>

              <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mt-3"
                  disabled={isLoading}
              >
                Registrar
              </Button>
            </Form>
          </Card.Body>
        </Card>

        <ToastContainer />
      </Container>
  );
};

export default RegisterForm;

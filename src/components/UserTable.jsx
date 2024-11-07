// src/components/UserTable.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Obtener todos los usuarios al montar el componente
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get(
            "http://mytube.rodrigomaidana.com:8081/users/all"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error al obtener usuarios:", error);
      }
    };
    fetchUsers();
  }, []);

  // Manejar edición de usuario
  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Manejar eliminación de usuario
  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/users/profile/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Cerrar modal de edición
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
      <Container className="mt-5">
        <h2 className="text-center mb-4">Lista de Usuarios</h2>
        <Table striped bordered hover>
          <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
          </thead>
          <tbody>
          {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <div className="d-flex">
                    <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEdit(user)}
                    >
                      Editar
                    </Button>
                    <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </td>
              </tr>
          ))}
          </tbody>
        </Table>

        {/* Modal de edición */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Editar Usuario</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
                <form>
                  <div className="mb-3">
                    <label className="form-label">Nombre de Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        defaultValue={selectedUser.username}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        defaultValue={selectedUser.email}
                    />
                  </div>
                </form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCloseModal}>
              Guardar Cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
  );
};

export default UserTable;

import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ username: "", email: "" });

  // Obtener todos los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "/users/all"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  // Manejar edición de usuario
  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedUser({ username: user.username, email: user.email });
    setShowModal(true);
  };

  // Guardar cambios del usuario
  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/users/${selectedUser._id}`,
        editedUser
      );
      console.log("Usuario actualizado:", response.data);

      // Actualizar la lista de usuarios en el frontend
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? response.data : user
        )
      );

      handleCloseModal();
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  // Manejar eliminación de usuario
  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(
        `/users/${userId}`
      );
      console.log("Usuario eliminado con éxito");

      // Actualizar la lista de usuarios en el frontend
      setUsers(users.filter((user) => user._id !== userId));
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
                    onClick={() => handleDelete(user._id)}
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
                  value={editedUser.username}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, username: e.target.value })
                  }
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={editedUser.email}
                  onChange={(e) =>
                    setEditedUser({ ...editedUser, email: e.target.value })
                  }
                />
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserTable;

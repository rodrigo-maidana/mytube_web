import React, { useState, useEffect } from "react";
import { Table, Button, Container, Modal, Pagination } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editedUser, setEditedUser] = useState({ username: "", email: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await axiosInstance.get("/users/all", {
        params: { page, limit: itemsPerPage },
      });
      const newUsers = response.data;

      if (newUsers.length > 0) {
        setUsers((prevUsers) => [...prevUsers, ...newUsers]);
      } else {
        setHasMore(false); // No hay más usuarios para cargar
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  const handlePageChange = (direction) => {
    if (direction === "next" && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      setHasMore(true); // Reactiva hasMore al retroceder
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditedUser({ username: user.username, email: user.email });
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axiosInstance.put(
        `/users/${selectedUser._id}`,
        editedUser
      );
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

  const handleDelete = async (userId) => {
    try {
      await axiosInstance.delete(`/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  // Función para cerrar el modal de edición
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

      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          className="me-2"
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant="primary"
          onClick={() => handlePageChange("next")}
          disabled={!hasMore}
        >
          Siguiente
        </Button>
      </div>

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

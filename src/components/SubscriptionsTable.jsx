// src/components/SubscriptionsTable.jsx
import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener suscripciones
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/all");
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error al obtener suscripciones:", error);
        setError("Error al obtener las suscripciones");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
      <div className="container mt-4">
        <h2 className="text-center mb-4">Suscripciones</h2>

        {loading ? (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
        ) : error ? (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
        ) : (
            <Table striped bordered hover responsive>
              <thead>
              <tr>
                <th>User ID</th>
                <th>Channel ID</th>
                <th>Fecha de Suscripción</th>
              </tr>
              </thead>
              <tbody>
              {subscriptions.map((subscription, index) => (
                  <tr key={index}>
                    <td>{subscription.userId}</td>
                    <td>{subscription.channelId}</td>
                    <td>
                      {new Date(subscription.subscriptionDate).toLocaleDateString()}
                    </td>
                  </tr>
              ))}
              </tbody>
            </Table>
        )}
      </div>
  );
}

export default SubscriptionsTable;

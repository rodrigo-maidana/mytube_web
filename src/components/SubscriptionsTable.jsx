import React, { useEffect, useState } from "react";
import { Table, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "./axiosinstance";

function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Obtener suscripciones
    const fetchSubscriptions = async () => {
      try {
        const response = await axiosInstance.get("/subscriptions/all");
        setSubscriptions(response.data);

        // Para cada suscripción, obten el nombre de usuario
        const usernamePromises = response.data.map(async (subscription) => {
          try {
            const userResponse = await axiosInstance.get(
              `/users/${subscription.userId}`
            );
            return {
              userId: subscription.userId,
              username: userResponse.data.username,
            };
          } catch (error) {
            console.error(
              `Error al obtener el username para userId ${subscription.userId}:`,
              error
            );
            return { userId: subscription.userId, username: "Desconocido" };
          }
        });

        // Espera todas las promesas de nombres de usuario y actualiza el estado
        const usernamesArray = await Promise.all(usernamePromises);
        const usernamesMap = usernamesArray.reduce(
          (acc, { userId, username }) => {
            acc[userId] = username;
            return acc;
          },
          {}
        );
        setUsernames(usernamesMap);
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
              <th>Username</th>
              <th>Channel ID</th>
              <th>Fecha de Suscripción</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((subscription, index) => (
              <tr key={index}>
                <td>{usernames[subscription.userId] || "Cargando..."}</td>
                <td>{subscription.channelId}</td>
                <td>
                  {new Date(subscription.subscriptionDate).toLocaleDateString(
                    "es-ES",
                    {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    }
                  )}
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

import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
function SubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    // Función para obtener las suscripciones
    const fetchSubscriptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/subscriptions/all"
        );
        setSubscriptions(response.data);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    <div>
      <h2>Suscripciones</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Channel ID</th>
            <th>Subscription Date</th>
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
    </div>
  );
}

export default SubscriptionsTable;

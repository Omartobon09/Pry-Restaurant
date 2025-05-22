"use client";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PendingOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const idSite = JSON.parse(localStorage.getItem("user")).idSite;

  useEffect(() => {
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/get/orders/today/sites/${idSite}`
        );
        const filteredOrders = response.data.resultado.filter(
          (order) => order.StatusOrder === "Listo" || order.StatusOrder === "Pendiente"
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching pending orders:", error);
      }
    };

    fetchPendingOrders();
  }, [idSite]);

  const handleEditClick = (idOrder) => {
    localStorage.setItem("orderId", idOrder);
    window.location.href = '/cocineros/orders/edit-orders';
  };

  return (
    <>
      <h2>Órdenes Pendientes</h2>
      <Table aria-label="Lista de órdenes pendientes" className="CustomTable">
        <TableHeader>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Número de Mesa</TableColumn>
          <TableColumn>Hora de la Orden</TableColumn>
          <TableColumn>Estado de la orden</TableColumn>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.idOrder}>
              <TableCell>{order.Description}</TableCell>
              <TableCell>{order.NumberTable}</TableCell>
              <TableCell>{order.TimeOrder}</TableCell>
              <TableCell>
                {order.StatusOrder}
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                  onClick={() => handleEditClick(order.idOrder)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default PendingOrdersPage;

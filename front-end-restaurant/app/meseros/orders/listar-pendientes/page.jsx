"use client";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";

const MeseroPage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [orders, setOrders] = useState([]);
  const [adminSite, setAdminSite] = useState(null);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idSite) {
      setAdminSite(user.idSite);
      setAdminUser(user.idUser);
    }
  }, []);

  const getPendingOrders = () => {
    axios
      .get("http://127.0.0.1:8000/get/orders/status/pending")
      .then((response) => {
        const filteredOrders = response.data.resultado.filter(
          (order) => order.idSite === adminSite && order.idUser === adminUser
        );
        setOrders(filteredOrders);
      })
      .catch((error) => {
        console.error("Error al obtener las órdenes pendientes:", error);
      });
  };

  useEffect(() => {
    getPendingOrders();
  }, [adminSite, adminUser]);

  const handleEditClick = (idOrder) => {
    localStorage.setItem("orderId", idOrder);
    router.push(`/meseros/orders/edit-order`);
  };
  const handleDeleteClick = (idOrder) => {
    axios
      .delete(`http://127.0.0.1:8000/delete/orders/${idOrder}`)
      .then((response) => {
        console.log("Orden eliminada correctamente");
        setOrders(orders.filter((order) => order.idOrder !== idOrder));
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <h2>Tus Ordenes</h2>
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
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(order.idOrder)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MeseroPage;

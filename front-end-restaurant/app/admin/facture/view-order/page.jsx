"use client";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoiceDollar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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

const SalePage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [orders, setOrders] = useState([]);
  const [adminSite, setAdminSite] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idSite) {
      setAdminSite(user.idSite);
    }
  }, []);

  const getPendingOrders = () => {
    axios
      .get("http://127.0.0.1:8000/get/orders/status/entregado")
      .then((response) => {
        const filteredOrders = response.data.resultado.filter(
          (order) => order.idSite === adminSite
        );
        setOrders(filteredOrders);
      })
      .catch((error) => {
        console.error("Error al obtener las órdenes completadas:", error);
      });
  };

  useEffect(() => {
    getPendingOrders();
  }, [adminSite]);

  const handlePrintClick = (orderId) => {
    localStorage.setItem("OrderId", orderId);
    router.push(`/admin/facture/create-facture`);
  };
  const handleDeleteClick = (orderId) => {
    if (typeof orderId !== "number" || isNaN(orderId)) {
      console.error("ID de orden no válido:", orderId);
      return;
    }

    axios
      .delete(`http://127.0.0.1:8000/delete/orders/${orderId}`)
      .then((response) => {
        const updatedOrders = orders.filter(
          (order) => order.idOrder !== orderId
        );
        setOrders(updatedOrders);
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Orden eliminada correctamente",
        });
      })
      .catch((error) => {
        console.error("Error al eliminar la orden:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar la orden",
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <h2>Órdenes Completadas</h2>
      <Table aria-label="Lista de órdenes Completadas" className="CustomTable">
        <TableHeader>
          <TableColumn>Descripción</TableColumn>
          <TableColumn>Número de Mesa</TableColumn>
          <TableColumn>Hora de la Orden</TableColumn>
          <TableColumn>Estado de la orden</TableColumn>
          <TableColumn>Acciones</TableColumn>{" "}
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.idOrder}>
              <TableCell>{order.Description}</TableCell>
              <TableCell>{order.NumberTable}</TableCell>
              <TableCell>{order.TimeOrder}</TableCell>
              <TableCell>{order.StatusOrder}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon={faFileInvoiceDollar}
                  style={{ marginRight: "20px", cursor: "pointer" }}
                  onClick={() => handlePrintClick(order.idOrder)}
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

export default SalePage;

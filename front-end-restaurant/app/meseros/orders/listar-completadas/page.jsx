"use client";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.idOrder}>
              <TableCell>{order.Description}</TableCell>
              <TableCell>{order.NumberTable}</TableCell>
              <TableCell>{order.TimeOrder}</TableCell>
              <TableCell>{order.StatusOrder}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MeseroPage;

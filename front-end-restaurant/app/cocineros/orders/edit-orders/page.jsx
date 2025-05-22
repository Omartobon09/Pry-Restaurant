"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";

import { Controller, useForm } from "react-hook-form";
import "../../../css/style.css";

const EditOrder = () => {
  const toast = useRef(null);
  const { handleSubmit, control } = useForm();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const roles = [
    
    { label: "Listo", value: "Listo" },
  ];

  const orderId = localStorage.getItem("orderId");
  const userId = JSON.parse(localStorage.getItem("user")).idUser;

  useEffect(() => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      console.error("No se encontró el orderId en el localStorage.");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/get/orders/${orderId}`, {
        params: {
          idUser: userId,
        },
      })
      .then((response) => {
        const orderData = response.data.resultado;
        setOrder(orderData);
        setDescription(orderData.Description);
        setStatus(orderData.StatusOrder);
      })
      .catch((error) => {
        console.error("Error al obtener el pedido:", error);
      });
  }, [userId]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const onSubmit = () => {
    const orderId = localStorage.getItem("orderId");
    if (!orderId) {
      console.error("No se encontró el orderId en el localStorage.");
      return;
    }

    axios
      .put(`http://127.0.0.1:8000/update/orders/${orderId}`, {
        status,
        idUser: order.idUser,
        Description: description,
        NumberTable: order.NumberTable,
        StatusOrder: status,
        idSite: order.idSite,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "El estado del pedido se ha actualizado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el estado del pedido:", error);
      });
  };

  return (
    <>
      <Toast ref={toast} />
      {order && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
          <div className="title-form">Editar Pedido</div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="description">Descripción:</label>
              <InputText
                id="description"
                value={description}
                onChange={handleDescriptionChange}
                disabled
              />
            </div>
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="numberTable">Número de Mesa:</label>
              <InputText id="numberTable" value={order.NumberTable} disabled />
            </div>
          </div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="timeOrder">Hora de la Orden:</label>
              <InputText id="timeOrder" value={order.TimeOrder} disabled />
            </div>
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="status">Estado del Pedido:</label>
              <Dropdown
                id="status"
                value={status}
                options={roles}
                onChange={handleStatusChange}
                placeholder="Seleccione un estado"
              />
            </div>
          </div>
          <div className="p-col-12">
            <Button
              label="Actualizar Estado"
              type="submit"
              className="p-button-sm"
              style={{ width: "auto", marginBottom: "20px" }}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditOrder;

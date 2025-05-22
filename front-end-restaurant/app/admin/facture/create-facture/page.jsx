"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import "../../../css/style.css";

const CreateInvoicePage = () => {
  const toast = useRef(null);
  const { handleSubmit } = useForm();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("Aprobado");
  const [idSite, setIdSite] = useState(null);
  const [orderDescription, setOrderDescription] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idSite) {
      setIdSite(user.idSite);
    }

    const orderId = localStorage.getItem("OrderId");
    if (orderId) {
      getOrderDescription(orderId);
    }
  }, []);

  useEffect(() => {
    const final = totalAmount - (totalAmount * discount) / 100;
    setFinalAmount(final);
  }, [totalAmount, discount]);

  const getOrderDescription = async (orderId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/get/orders/${orderId}`
      );
      const description = response.data.resultado.Description;
      const userId = response.data.resultado.idUser;
      setSelectedOrder({ idOrder: orderId });
      setOrderDescription(description);
      setUserId(userId);
    } catch (error) {
      console.error("Error al obtener la descripción de la orden:", error);
    }
  };

  const onSubmit = () => {
    if (!selectedOrder) {
      console.error("No se ha seleccionado ninguna orden.");
      return;
    }
    const paymentDate = new Date().toISOString();

    axios
      .post("http://127.0.0.1:8000/post/invoice", {
        idOrder: selectedOrder.idOrder,
        TotalAmount: totalAmount,
        Discount: discount,
        FinalAmount: finalAmount,
        PaymentStatus: paymentStatus,
        PaymentDate: paymentDate,
        CreationDate: paymentDate,
        idSite: idSite,
        idUser: userId,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Factura creada exitosamente.",
        });
        setSelectedOrder(null);
        setTotalAmount(0);
        setDiscount(0);
        setFinalAmount(0);
        setPaymentStatus("Aprobado");
      })
      .catch((error) => {
        console.error("Error al crear la factura:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "No se pudo crear la factura.",
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
        <div className="title-form">Crear Factura</div>
        <div className="p-col-12">
          <div className="formgrid" style={{ marginBottom: "20px" }}>
            <label htmlFor="order">Descripción de la Orden:</label>
            <InputText
              id="orderDescription"
              value={orderDescription}
              readOnly
            />
          </div>
          <div className="formgrid" style={{ marginBottom: "20px" }}>
            <label htmlFor="totalAmount">Total a Pagar:</label>
            <InputText
              id="totalAmount"
              value={totalAmount}
              onChange={(e) => setTotalAmount(e.target.value)}
            />
          </div>
          <div className="formgrid" style={{ marginBottom: "20px" }}>
            <label htmlFor="discount">Descuento (%):</label>
            <InputText
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div className="formgrid" style={{ marginBottom: "20px" }}>
            <label htmlFor="finalAmount">Final a Pagar:</label>
            <InputText id="finalAmount" value={finalAmount} readOnly />
          </div>
          <div className="formgrid" style={{ marginBottom: "20px" }}>
            <label htmlFor="paymentStatus">Estado de Pago:</label>
            <Dropdown
              id="paymentStatus"
              value={paymentStatus}
              options={[{ label: "Aprobado", value: "Aprobado" }]}
              onChange={(e) => setPaymentStatus(e.target.value)}
              placeholder="Seleccione un estado"
            />
          </div>
          <div className="p-col-12">
            <Button
              label="Crear Factura"
              type="submit"
              className="p-button-sm"
              style={{ width: "auto", marginBottom: "20px" }}
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default CreateInvoicePage;

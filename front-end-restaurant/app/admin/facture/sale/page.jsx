"use client"
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";

const SalePage = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("http://127.0.0.1:8000/get/invoice");
        const filteredSales = response.data.resultado.filter(
          (sale) => sale.idSite === user.idSite
        );
        const salesWithDescription = await Promise.all(
          filteredSales.map(async (sale) => {
            const descriptionResponse = await axios.get(
              `http://127.0.0.1:8000/get/order/description/${sale.idOrder}`
            );
            return {
              ...sale,
              orderDescription: descriptionResponse.data.resultado,
            };
          })
        );
        setSales(salesWithDescription);
      } catch (error) {
        console.error("Error fetching sales:", error);
      }
    };
    fetchData();
  }, []);

  const handlePrintSale = (sale) => {
    const doc = new jsPDF();
    doc.text(`Código de factura: ${sale.idInvoice}`, 10, 20);
    doc.text(`Descripción de Orden: ${sale.orderDescription}`, 10, 30);
    doc.text(`Total a Pagar: ${sale.TotalAmount}`, 10, 40);
    doc.text(`Descuento: ${sale.Discount}`, 10, 50);
    doc.text(`Final a Pagar: ${sale.FinalAmount}`, 10, 60);
    doc.text(`Estado de Factura: ${sale.PaymentStatus}`, 10, 70);
    doc.text(`Fecha de creación: ${sale.CreationDate}`, 10, 80);
    doc.save(`Código de factura: ${sale.idInvoice}.pdf`);
  };

  return (
    <>
      <h2>Lista de facturas</h2>
      <Table aria-label="Lista de facturas" className="CustomTable">
        <TableHeader>
          <TableColumn>Código Factura</TableColumn>
          <TableColumn>Descripción de Orden</TableColumn>
          <TableColumn>Total a Pagar</TableColumn>
          <TableColumn>Descuento</TableColumn>
          <TableColumn>Final a Pagar</TableColumn>
          <TableColumn>Estado de Factura</TableColumn>
          <TableColumn>Fecha de creación</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.idInvoice}>
              <TableCell>{sale.idInvoice}</TableCell>
              <TableCell>{sale.orderDescription}</TableCell>
              <TableCell>{sale.TotalAmount}</TableCell>
              <TableCell>{sale.Discount}</TableCell>
              <TableCell>{sale.FinalAmount}</TableCell>
              <TableCell>{sale.PaymentStatus}</TableCell>
              <TableCell>{sale.CreationDate}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon={faPrint}
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePrintSale(sale)}
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

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SalePage = () => {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await axios.get("http:127.0.0.1:8000/get/invoice");
        const filteredSales = response.data.resultado.filter(
          (sale) => sale.idSite === user.idSite
        );
        const salesWithDescription = await Promise.all(
          filteredSales.map(async (sale) => {
            const descriptionResponse = await axios.get(
              `http:127.0.0.1:8000/get/order/description/${sale.idOrder}`
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

    const leftMargin = 25;
    let y = 30;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Restaurante Festín", 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Factura Electrónica", 105, y, { align: "center" });

    y += 10;
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y);

    y += 15;

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0);
    doc.text("Fecha de Creación:", leftMargin, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${sale.CreationDate}`, leftMargin + 60, y);
    y += 12;

    const regularData = [
      ["Código de Factura", sale.idInvoice],
      ["Descripción de Orden", sale.orderDescription],
      ["Total a Pagar", sale.TotalAmount],
      ["Descuento", sale.Discount],
    ];

    regularData.forEach(([label, value]) => {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text(`${label}:`, leftMargin, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${value}`, leftMargin + 60, y);
      y += 10;
    });

    const highlightedData = [
      ["Final a Pagar", sale.FinalAmount],
      ["Estado de Factura", sale.PaymentStatus],
    ];

    highlightedData.forEach(([label, value]) => {
      doc.setFillColor(0, 0, 0);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.rect(leftMargin - 5, y - 7, 160, 10, "F");
      doc.text(`${label}:`, leftMargin, y);
      doc.text(`${value}`, leftMargin + 60, y);
      y += 12;
    });

    doc.setFontSize(10);
    doc.setTextColor(0);
    doc.setFont("helvetica", "italic");
    doc.text("Firma autorizada", 145, y + 20);
    doc.line(140, y + 22, 190, y + 22);

    doc.setDrawColor(0);
    doc.rect(15, 15, 180, y - 5 + 40);

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("Gracias por su compra - Restaurante Festín", 105, 285, {
      align: "center",
    });

    doc.save(`Factura-${sale.idInvoice}.pdf`);
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
              <TableCell>{sale.CreationDate}</TableCell>
              <TableCell>{sale.orderDescription}</TableCell>
              <TableCell>{sale.TotalAmount}</TableCell>
              <TableCell>{sale.Discount}</TableCell>
              <TableCell>{sale.FinalAmount}</TableCell>
              <TableCell>{sale.PaymentStatus}</TableCell>
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

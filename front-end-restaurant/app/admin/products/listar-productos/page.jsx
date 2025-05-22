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
import { useEffect, useState } from "react";

const ProductPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get/products")
      .then((response) => {
        setProducts(response.data.resultado);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
        setProducts([]);
      });
  }, []);

  const handleEditClick = (idProduct) => {
    localStorage.setItem("productId", idProduct);
    window.location.href = `/admin/products/edit-productos`; 
  };

  return (
    <>
      <h2>Productos</h2>
      <Table aria-label="Lista de productos" className="CustomTable">
        <TableHeader>
          <TableColumn>Nombre</TableColumn>
          <TableColumn>Unidad</TableColumn>
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {Array.isArray(products) &&
            products.map((product) => (
              <TableRow key={product.idProduct}>
                <TableCell>{product.NameProduct}</TableCell>
                <TableCell>{product.Unit}</TableCell>
                <TableCell>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleEditClick(product.idProduct)}
                  />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};

export default ProductPage;

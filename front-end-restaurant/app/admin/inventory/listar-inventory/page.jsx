"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Toast } from "primereact/toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const InventoryPage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [inventoryProducts, setInventoryProducts] = useState([]);
  const [adminSite, setAdminSite] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idSite) {
      setAdminSite(user.idSite);
      fetchInventoryProducts(user.idSite);
    }
  }, []);

  const fetchInventoryProducts = async (idSite) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/get/inventory-products?idSite=${idSite}`
      );
      const productsWithNames = await Promise.all(
        response.data.resultado.map(async (product) => {
          const productResponse = await axios.get(
            `http://127.0.0.1:8000/get/products/${product.idProduct}`
          );
          return {
            ...product,
            nameProduct: productResponse.data.resultado.NameProduct,
            unit: productResponse.data.resultado.Unit, 
          };
        })
      );
      setInventoryProducts(productsWithNames);
    } catch (error) {
      console.error("Error al obtener el inventario de productos:", error);
    }
  };

  const handleEditClick = (id) => {
    localStorage.setItem("id", id);
    router.push(`/admin/inventory/edit-inventory`);
  };

  const handleDeleteClick = async (id) => {
    try {
      await axios.delete(
        `http://127.0.0.1:8000/delete/inventory-products/${id}`
      );

      const updatedProducts = inventoryProducts.filter(
        (product) => product.id !== id
      );
      setInventoryProducts(updatedProducts);
      toast.current.show({
        severity: "success",
        summary: "Producto eliminado",
        detail: "El producto ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Hubo un error al intentar eliminar el producto.",
      });
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <h2>Inventario de Productos</h2>
      <Table aria-label="Inventario de productos" className="CustomTable">
        <TableHeader>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Nombre de Producto</TableColumn>
          <TableColumn>Unidad</TableColumn> 
          <TableColumn>Acciones</TableColumn>
        </TableHeader>
        <TableBody>
          {inventoryProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>{product.nameProduct}</TableCell>
              <TableCell>{product.unit}</TableCell>
              <TableCell>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  style={{ marginLeft: "20px", cursor: "pointer" }}
                  onClick={() => handleEditClick(product.id)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={() => handleDeleteClick(product.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default InventoryPage;

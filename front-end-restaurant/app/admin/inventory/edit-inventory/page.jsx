"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import "../../../css/style.css";

const EditInventoryProduct = () => {
  const toast = useRef(null);
  const { handleSubmit, control } = useForm();
  const [inventoryProduct, setInventoryProduct] = useState(null);
  const [quantity, setQuantity] = useState("");

  const id = localStorage.getItem("id");

  useEffect(() => {
    if (!id) {
      console.error("No se encontró el ID del producto en el localStorage.");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/get/inventory-products/${id}`)
      .then((response) => {
        const inventoryProductData = response.data.resultado;
        setQuantity(inventoryProductData.quantity);

        axios
          .get(
            `http://127.0.0.1:8000/get/products/${inventoryProductData.idProduct}`
          )
          .then((productResponse) => {
            const productName = productResponse.data.resultado.NameProduct;
            setInventoryProduct({ ...inventoryProductData, productName });
          })
          .catch((error) => {
            console.error("Error al obtener el nombre del producto:", error);
          });
      })
      .catch((error) => {
        console.error("Error al obtener el producto del inventario:", error);
      });
  }, [id]);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const onSubmit = () => {
    if (!id) {
      console.error("No se encontró el ID del producto en el localStorage.");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));
    const idSite = user.idSite;
    const idProduct = inventoryProduct.idProduct;

    axios
      .put(`http://127.0.0.1:8000/update/inventory-products/${id}`, {
        idSite,
        idProduct,
        quantity,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "El producto del inventario se ha actualizado correctamente.",
        });
      })
      .catch((error) => {
        console.error("Error al actualizar el producto del inventario:", error);
      });
  };

  return (
    <>
      <Toast ref={toast} />
      {inventoryProduct && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
          <div className="title-form">Editar Producto del Inventario</div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="productName">Nombre del Producto:</label>
              <InputText
                id="productName"
                value={inventoryProduct.productName}
                readOnly
              />
            </div>
          </div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="quantity">Cantidad:</label>
              <InputText
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          </div>
          <div className="p-col-12">
            <Button
              label="Actualizar Producto"
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

export default EditInventoryProduct;

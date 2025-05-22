"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import "../../../css/style.css";

const EditProduct = () => {
  const toast = useRef(null);
  const { handleSubmit, control } = useForm();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const units = [
    { label: "Kilogramo (kg)", value: "Kilogramo" },
    { label: "Gramo (g)", value: "Gramo" },
    { label: "Litro (l)", value: "Litro" },
    { label: "Mililitro (ml)", value: "Mililitro" },
  ];

  const productId = localStorage.getItem("productId");

  useEffect(() => {
    if (!productId) {
      console.error("No se encontró el ID del producto en el localStorage.");
      return;
    }

    axios
      .get(`http://127.0.0.1:8000/get/products/${productId}`)
      .then((response) => {
        const productData = response.data.resultado;
        setProduct(productData);
        setName(productData.NameProduct);
        setUnit(productData.Unit);
      })
      .catch((error) => {
        console.error("Error al obtener el producto:", error);
      });
  }, [productId]);

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUnitChange = (selectedUnit) => {
    setUnit(selectedUnit);
  };

  const onSubmit = () => {
    const productId = localStorage.getItem("productId");
    if (!productId) {
      console.error("No se encontró el ID del producto en el localStorage.");
      return;
    }

    axios
      .put(`http://127.0.0.1:8000/update/products/${productId}`, {
        NameProduct: name,
        Unit: unit,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "El producto se ha actualizado correctamente.",
        });
        window.location.href = "/admin/products/listar-productos";
      })
      .catch((error) => {
        console.error("Error al actualizar el producto:", error);
      });
  };

  return (
    <>
      <Toast ref={toast} />
      {product && (
        <form onSubmit={handleSubmit(onSubmit)} className="p-grid p-fluid">
          <div className="title-form">Editar Producto</div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="name">Nombre:</label>
              <InputText id="name" value={name} onChange={handleNameChange} />
            </div>
          </div>
          <div className="p-col-6">
            <div className="p-field" style={{ marginBottom: "20px" }}>
              <label htmlFor="unit">Unidad:</label>
              <Dropdown
                id="unit"
                value={unit}
                options={units}
                onChange={(e) => handleUnitChange(e.value)}
                placeholder="Seleccione una unidad"
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

export default EditProduct;

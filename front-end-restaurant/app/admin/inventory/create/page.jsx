"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import "../../../css/style.css";

const AddOrderForm = () => {
  const toast = useRef(null);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProductUnit, setSelectedProductUnit] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/get/products")
      .then((response) => {
        setProducts(response.data.resultado);
      })
      .catch((error) => {
        console.error("Error al obtener los productos:", error);
      });
  }, []);

  const handleProductChange = (e) => {
    setSelectedProduct(e.value);
    const product = products.find((product) => product.idProduct === e.value);
    setSelectedProductUnit(product ? product.Unit : "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor seleccione un producto.",
      });
      return;
    }
    if (!quantity) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Por favor ingrese una cantidad.",
      });
      return;
    }
    const data = {
      quantity: quantity,
      idSite: user.idSite,
      idProduct: selectedProduct,
    };
    axios
      .post("http://127.0.0.1:8000/post/inventory-products", data)
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "La orden se ha agregado correctamente.",
        });
        setQuantity("");
        setSelectedProduct(null);
      })
      .catch((error) => {
        console.error("Error al agregar la orden:", error);
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            "Ocurrió un error al agregar la orden. Por favor, inténtelo de nuevo más tarde.",
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit} className="p-grid p-fluid">
        <div className="title-form">Inventariar</div>
        <div className="p-col-6">
          <div className="formgrid">
            <label htmlFor="quantity">Cantidad:</label>
            <InputText
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>
        <div className="p-col-6">
          <div className="formgrid">
            <label htmlFor="product">Producto:</label>
            <Dropdown
              id="product"
              value={selectedProduct}
              options={
                products &&
                products.map((product) => ({
                  label: product.NameProduct,
                  value: product.idProduct,
                }))
              }
              onChange={handleProductChange}
              placeholder="Seleccione un producto"
            />
          </div>
        </div>
        <div className="p-col-6">
          <div className="formgrid">
            <label htmlFor="unit">Unidad:</label>
            <InputText id="unit" value={selectedProductUnit} readOnly />
          </div>
        </div>
        <div className="p-col-12">
          <Button
            type="submit"
            label="Agregar Orden"
            className="p-button-sm"
            style={{ width: "auto", marginBottom: "20px" }}
          />
        </div>
      </form>
    </>
  );
};


export default AddOrderForm;

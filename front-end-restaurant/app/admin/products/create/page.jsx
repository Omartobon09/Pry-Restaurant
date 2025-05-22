"use client";
import React, { useRef } from "react";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useForm, Controller } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "../../../css/style.css";

const CreateProduct = () => {
  const toast = useRef(null);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      NameProduct: "",
      Unit: "",
    },
  });


  const units = [
    { label: "Kilogramo (kg)", value: "Kilogramo" },
    { label: "Gramo (g)", value: "Gramo" },
    { label: "Litro (l)", value: "Litro" },
    { label: "Mililitro (ml)", value: "Mililitro" },
  ];

  const onSubmit = (data) => {
    axios
      .post("http://127.0.0.1:8000/post/products", {
        ...data,
      })
      .then((response) => {
        reset();
        toast.current.show({
          severity: "success",
          summary: "Producto Agregado Correctamente",
          detail: response.data.informacion,
          life: 3000,
        });
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Error al agregar el producto",
          detail: error.response.data.resultado,
          life: 3000,
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="title-form">Crear producto</div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="NameProduct"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Nombre del producto</label>
                    <InputText
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.target.value)}
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    {fieldState.error && (
                      <small className="text-red-600">Campo requerido</small>
                    )}
                  </div>
                </>
              )}
            />
          </div>
          <div className="field col">
            <Controller
              name="Unit"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Unidad</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      options={units}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="label"
                      placeholder="Seleccione una unidad"
                      className={classNames({ "p-invalid": fieldState.error })}
                    />
                    {fieldState.error && (
                      <small className="text-red-600">Campo requerido</small>
                    )}
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <Button type="submit" label="Agregar Producto" />
      </form>
    </>
  );
};

export default CreateProduct;

"use client";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import "../../../css/style.css";


const CreateOrder = () => {
  const toast = useRef(null);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Description: "",
      NumberTable: "",
      StatusOrder: "",
    },
  });

  const onSubmit = (data) => {
    axios
      .post("http://127.0.0.1:8000/post/orders", {
        ...data,
        idUser: getUserId(),
        TimeOrder: new Date().toISOString(),
        idSite: getSiteId(),
      })
      .then((response) => {
        reset();
        toast.current.show({
          severity: "success",
          summary: "Orden Creada Correctamente",
          detail: response.data.message,
          life: 3000,
        });
      });
  };


  const getUserId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user.idUser;
  };

  const getSiteId = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user.idSite;
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="title-form">Crear orden</div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="Description"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Descripción</label>
                    <InputText
                      type="text"
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
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="NumberTable"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Número de mesa</label>
                    <InputText
                      type="text"
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
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="StatusOrder"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Estado de la orden</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={[
                        { label: "Pendiente", value: "Pendiente" },
                      ]}
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
        <Button type="submit" label="Agregar Orden" />
      </form>
    </>
  );
};
<Button type="submit" label="Agregar Orden" className="custom-button" />

export default CreateOrder;

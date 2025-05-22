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

const CreateUser = () => {
  const toast = useRef(null);
  const [typesUsers, setTypesUser] = useState([]);
  const [sites, setSites] = useState([]);
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      Name: "",
      Email: "",
      Password: "",
      idTypeUser: "",
      idSite: "",
    },
  });

  const onSubmit = (data) => {
    axios
      .post("http://127.0.0.1:8000/post/users", {
        ...data,
      })
      .then((response) => {
        reset();
        toast.current.show({
          severity: "success",
          summary: "Usuario Agregado Correctamente",
          detail: response.data.message,
          life: 3000,
        });
      });
  };

  const getTypesUsers = () => {
    const tiposUsuarios = [
      { id: 1, name: "Administrador" },
      { id: 2, name: "Mesero" },
      { id: 3, name: "Cocinero" },
    ];
    setTypesUser(tiposUsuarios);
  };

  const getSites = () => {
    const sedes = [
      { id: 1, name: "Sede 1" },
      { id: 2, name: "Sede 2" },
      { id: 3, name: "Sede 3" },
    ];
    setSites(sedes);
  };

  useEffect(() => {
    getTypesUsers();
    getSites();
  }, []);

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="title-form">Crear usuario</div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="Name"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Nombre</label>
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
              name="Email"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Email</label>
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
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="Password"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Contraseña</label>
                    <InputText
                      id={field.name}
                      type="password"
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
              name="idTypeUser"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Tipo de Usuario</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={typesUsers}
                      optionLabel="name"
                      optionValue="id"
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
              name="idSite"
              control={control}
              rules={{ required: true }}
              render={({ field, fieldState }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Sede</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={sites}
                      optionLabel="name"
                      optionValue="id"
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
        <Button type="submit" label="Agregar Usuario" />
      </form>
    </>
  );
};

export default CreateUser;

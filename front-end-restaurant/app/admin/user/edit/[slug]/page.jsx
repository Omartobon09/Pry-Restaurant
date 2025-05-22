"use client";
import axios from "axios";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

export default function EditUser() {
  const toast = useRef(null);
  const { control, handleSubmit } = useForm();
  const infouser = JSON.parse(localStorage.getItem("useredit"));
  const roles = [
    { id: 1, name: "Administrador" },
    { id: 2, name: "Mesero" },
    { id: 3, name: "Cocinero" },
  ];
  const sites = [
    { id: 1, name: "Sede 1" },
    { id: 2, name: "Sede 2" },
    { id: 3, name: "Sede 3" },
  ];

  const onSubmit = (data) => {
    axios
      .put("http://127.0.0.1:8000/update/users/" + infouser.idUser, {
        ...data,
        idTypeUser: data.Rol.id,
        idSite: data.Sede.id,
      })
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: response.data.informacion,
          life: 3000,
        });
      });
  };

  return (
    <>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <h5>Editar usuario</h5>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="Name"
              control={control}
              defaultValue={infouser.Name}
              render={({ field }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Nombre</label>
                    <InputText id={field.name} {...field} />
                  </div>
                </>
              )}
            />
          </div>
          <div className="field col">
            <Controller
              name="Email"
              control={control}
              defaultValue={infouser.Email}
              render={({ field }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Email</label>
                    <InputText id={field.name} {...field} />
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
              defaultValue={infouser.Password}
              render={({ field }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Contraseña</label>
                    <InputText id={field.name} {...field} />
                  </div>
                </>
              )}
            />
          </div>
          <div className="field col">
            <Controller
              name="Rol"
              control={control}
              defaultValue={infouser.Rol}
              render={({ field }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Rol</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      options={roles}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="name"
                    />
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <div className="formgrid grid">
          <div className="field col">
            <Controller
              name="Sede"
              control={control}
              defaultValue={infouser.Sede}
              render={({ field }) => (
                <>
                  <div className="flex flex-column">
                    <label htmlFor={field.name}>Sede</label>
                    <Dropdown
                      id={field.name}
                      value={field.value}
                      options={sites}
                      onChange={(e) => field.onChange(e.value)}
                      optionLabel="name"
                    />
                  </div>
                </>
              )}
            />
          </div>
        </div>
        <Button type="submit" label="Actualizar" icon="pi pi-user-edit" />
      </form>
    </>
  );
}

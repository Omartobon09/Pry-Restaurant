"use client";
import axios from "axios";
import { Button } from "primereact/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import "../style.css";

const AdminPage = () => {
  const router = useRouter();
  const toast = useRef(null);
  const [users, setUsers] = useState([]);
  const [adminSite, setAdminSite] = useState(null); 

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.idSite) {
      setAdminSite(user.idSite);
    }
  }, []);

  const getAllUsers = () => {
    axios
      .get("http://127.0.0.1:8000/get/users")
      .then((response) => {
        const usersFilteredBySite = response.data.resultado.filter(
          (user) => user.idSite === adminSite
        );
        setUsers(usersFilteredBySite);
      })
      .catch((error) => {
        console.error("Error al obtener los usuarios:", error);
      });
  };

  const deleteUser = (id) => {
    axios
      .delete(`http://127.0.0.1:8000/delete/users/${id}`)
      .then((rs) => {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: rs.data.informacion,
          life: 3000,
        });
        return getAllUsers();
      })
      .catch((error) => {
        console.error("Error al eliminar el usuario:", error);
      });
  };

  const actionsTemplate = (data) => {
    return (
      <div className="flex gap-2">
        <Button
          outlined
          icon="pi pi-trash"
          onClick={() => deleteUser(data.idUser)}
        />
        <Button
          outlined
          icon="pi pi-user-edit"
          onClick={() => {
            localStorage.setItem("useredit", JSON.stringify(data));
            return router.push(`/admin/user/edit/${data.idUser}`);
          }}
        />
      </div>
    );
  };

  useEffect(() => {
    getAllUsers();
  }, [adminSite]);

  return (
    <>
      <Toast ref={toast} />
      <h2>Lista de Empleados</h2>
      <Table aria-label="Lista de usuarios" className="CustomTable">
        <TableHeader>
          <TableColumn>Acciones</TableColumn>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Password</TableColumn>
          <TableColumn>Rol</TableColumn>
          <TableColumn>Sede</TableColumn>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.idUser}>
              <TableCell>{actionsTemplate(user)}</TableCell>
              <TableCell>{user.Name}</TableCell>
              <TableCell>{user.Email}</TableCell>
              <TableCell>{user.Password}</TableCell>
              <TableCell>
                {user.idTypeUser === 1
                  ? "Administrador"
                  : user.idTypeUser === 2
                  ? "Mesero"
                  : user.idTypeUser === 3
                  ? "Cocinero"
                  : null}
              </TableCell>
              <TableCell>
                {user.idSite === 1
                  ? "Sede 1"
                  : user.idSite === 2
                  ? "Sede 2"
                  : user.idSite === 3
                  ? "Sede 3"
                  : null}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default AdminPage;

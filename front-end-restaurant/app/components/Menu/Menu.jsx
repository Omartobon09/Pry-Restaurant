"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.css";
import "./style.css";

const Menu = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMesero, setIsMesero] = useState(false);
  const [isCocinero, setIsCocinero] = useState(false);
  const [hora, setHora] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const user = JSON.parse(localStorage?.getItem("user"));

      if (user?.idTypeUser == 1) setIsAdmin(true);
      if (user?.idTypeUser == 2) setIsMesero(true);
      if (user?.idTypeUser == 3) setIsCocinero(true);

      const intervalo = setInterval(() => {
        const horaActual = new Date();
        const horaString = horaActual.toLocaleTimeString();
        setHora(horaString);
      }, 1000);
      return () => clearInterval(intervalo);
    }
  }, [isAdmin, isMesero, isCocinero]);
  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          {isAdmin && (
            <>
              <div className="sb-sidenav-menu-heading">
                1. Gestión de usuarios
              </div>
              <Link className="nav-link" href="/admin/user/listar">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-user"></i>
                </div>
                Usuarios
              </Link>
              <Link className="nav-link" href="/admin/user/create">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-user-plus"></i>
                </div>
                Agregar Usuario
              </Link>
              <div className="sb-sidenav-menu-heading">
                2. Gestión de Inventario
              </div>
              <Link className="nav-link" href="/admin/products/create">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                Crear Producto
              </Link>
              <Link
                className="nav-link"
                href="/admin/products/listar-productos"
              >
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                Ver Productos
              </Link>
              <Link className="nav-link" href="/admin/inventory/create">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-folder-plus"></i>
                </div>
                Agregar Productos al inventario
              </Link>
              <Link
                className="nav-link"
                href="/admin/inventory/listar-inventory"
              >
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-eye"></i>
                </div>
                Ver inventario
              </Link>
              <div className="sb-sidenav-menu-heading">
                3. Gestión de Facturas
              </div>
              <Link className="nav-link" href="/admin/facture/view-order">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-folder-open"></i>
                </div>
                Ver ordenes
              </Link>
              <Link className="nav-link" href="/admin/facture/sale">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-folder-plus"></i>
                </div>
                Ver facturas
              </Link>
            </>
          )}
          {isMesero && (
            <>
              <div className="sb-sidenav-menu-heading">1.Ordenes</div>
              <Link className="nav-link" href="/meseros/orders/create">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-person-circle-check"></i>
                </div>
                Agregar Orden
              </Link>
              <div className="sb-sidenav-menu-heading">2. Estado Ordenes</div>
              <Link
                className="nav-link"
                href="/meseros/orders/listar-pendientes"
              >
                <div className="sb-nav-link-icon">
                  <i className="fa-regular fa-hourglass-half"></i>
                </div>
                Tus Ordenes
              </Link>
              <Link
                className="nav-link"
                href="/meseros/orders/listar-completadas"
              >
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-check"></i>
                </div>
                Ordenes Completadas
              </Link>
            </>
          )}
          {isCocinero && (
            <>
              <div className="sb-sidenav-menu-heading">1. Ordenes</div>
              <Link className="nav-link" href="/cocineros/orders/listar-orders">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-person-circle-check"></i>
                </div>
                Ver ordenes
              </Link>
              <div className="sb-sidenav-menu-heading">2. Inventario</div>
              <Link className="nav-link" href="/cocineros/inventory/listar-inventory">
                <div className="sb-nav-link-icon">
                  <i className="fa-solid fa-person-chalkboard"></i>
                </div>
                Inventario actual
              </Link>
            </>
          )}
          <div className="hourse">{hora}</div>
        </div>
      </div>
    </nav>
  );
};
export default Menu;

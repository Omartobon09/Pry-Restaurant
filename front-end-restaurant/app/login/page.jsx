"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "./style.css";

function Formulario() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [saludo, setSaludo] = useState("");

  useEffect(() => {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 18) {
      setSaludo("¡Buenos días! ☀️");
    } else {
      setSaludo("¡Buenas noches! 🌙");
    }
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    axios
      .post("http://127.0.0.1:8000/login", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem("token_type", response.data.token_type);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
        axios.get("http://127.0.0.1:8000/usuario").then((res) => {
          localStorage.setItem("user", JSON.stringify(res.data));
          switch (res.data.idTypeUser) {
            case 1:
              return router.push(`/admin`);
              break;
            case 2:
              return router.push(`/meseros`);
              break;
            case 3:
              return router.push(`/cocineros`);
            default:
              break;
          }
        });
      })
      .then((response) => {
        setError(null);
      })
      .catch((error) => {
        console.error(error);
        setError("Correo Electronico o Contraseña Incorrectos");
      });
  };
  return (
    <form onSubmit={handleSubmit} className="forms">
      <div id="layoutAuthentication">
        <div id="layoutAuthentication_content">
          <main>
            <div className="container">
              <div className="container-forms">
                <div className="row justify-content-center h-100">
                  <div className="col-lg-5">
                    <div className="card">
                      <div className="card-header">
                        <p className="title-card">Inicio de Sesión</p>
                        <p>Hola, {saludo}</p>
                        <p>Por favor ingresa con tus credenciales otorgadas.</p>
                      </div>
                      <div className="card-body">
                        {error && (
                          <div className="alert alert-danger" role="alert">
                            {error}
                          </div>
                        )}

                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputUsername"
                            type="text"
                            placeholder="Nombre de usuario"
                            value={username}
                            onChange={handleUsernameChange}
                          />
                          <label htmlFor="inputUsername">
                            Correo Electronico
                          </label>
                        </div>
                        <div className="form-floating mb-3">
                          <input
                            className="form-control"
                            id="inputPassword"
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          <label htmlFor="inputPassword">Contraseña</label>
                        </div>
                        <div className="form-check mb-3">
                          <input
                            className="form-check-input"
                            id="inputRememberPassword"
                            type="checkbox"
                            value=""
                          />
                          <label
                            className="form-check-label"
                            htmlFor="inputRememberPassword"
                          >
                            Recordar Contraseña
                          </label>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                          <button className="btn btn-primary" type="submit">
                            Entrar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </form>
  );
}

export default Formulario;

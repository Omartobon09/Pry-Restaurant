"use client";
import React, { useEffect, useState } from "react";

export default function Welcome() {
  const [userData, setUserData] = useState();
  const [saludo, setSaludo] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const user = JSON.parse(localStorage?.getItem("user"));
      setUserData(user);
    }
  }, []);
  useEffect(() => {
    const horaActual = new Date().getHours();
    if (horaActual >= 6 && horaActual < 12) {
      setSaludo("¡Buenos días! ☀️");
    } else if (horaActual >= 12 && horaActual < 18) {
      setSaludo("¡Buenas tardes! 🌤️");
    } else {
      setSaludo("¡Buenas noches! 🌙");
    }
  }, []);
  return (
    <a className="navbar-brand ps-3" id="Welcome-per" href="#">
      {saludo} {userData?.Name}
    </a>
  );
}

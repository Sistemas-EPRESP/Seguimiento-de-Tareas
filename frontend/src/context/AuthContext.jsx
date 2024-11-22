import { createContext, useState, useEffect } from "react";
import axios from "axios";
import config from "../api/config.js";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para indicar que está verificando el token

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      // Si hay token, verificarlo con el backend
      axios
        .get(`${config.apiUrl}/verify-login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUsuario(response.data); // Establece los datos del usuario
        })
        .catch(() => {
          localStorage.removeItem("token"); // Si el token no es válido, eliminarlo
        })
        .finally(() => setLoading(false)); // Marcar que terminó la verificación
    } else {
      setLoading(false); // No hay token, por lo tanto, no hay usuario
    }
  }, []);

  const logout = () => {
    setUsuario(null); // Limpiar el usuario
    localStorage.removeItem("token"); // Eliminar el token de localStorage
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, logout }}>
      {" "}
      {children}
    </AuthContext.Provider>
  );
};

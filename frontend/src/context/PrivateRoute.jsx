import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";
import Loading from "../layout/Loading";

const PrivateRoute = ({ element, isAdminRequired = false }) => {
  const { usuario, loading } = useContext(AuthContext);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isAdminRequired && usuario && usuario.rol !== "Administrador") {
      setShowMessage(true);
      const timer = setTimeout(() => {
        setShowMessage(false); // Limpiar el mensaje después de 2 segundos
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isAdminRequired, usuario]);

  if (loading) {
    return <Loading />;
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (isAdminRequired && usuario.rol !== "Administrador") {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-xl font-semibold mb-4">
          No tienes permiso para acceder a esta página.
        </h2>
        {showMessage && (
          <p className="text-red-500">Redirigiendo a la página de inicio...</p>
        )}
        <Navigate to="/inicio" />
      </div>
    );
  }

  return element;
};

export default PrivateRoute;

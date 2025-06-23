import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Inicio from "../pages/Inicio";
import InicioAdmin from "../pages/InicioAdmin"; // Nueva página para administradores
import Buscar from "../pages/Buscar";
import CrearTarea from "../pages/CrearTarea";
import TareaDetalles from "../pages/TareaDetalles/TareaDetalles";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
import PrivateRoute from "../context/PrivateRoute";
import { TareaAgente } from "../pages/TareaAgente";
import MisTareas from "../pages/MisTareas";
import Reportes from "../pages/Reportes";

const AppRouter = () => {
  const { usuario } = useContext(AuthContext);

  return (
    <Routes>
      {/* Rutas según el rol */}
      {usuario?.rol === "Administrador" && (
        <Route
          path="/inicio"
          element={<PrivateRoute element={<InicioAdmin />} />}
        />
      )}
      {usuario?.rol === "Personal" && (
        <Route path="/inicio" element={<PrivateRoute element={<Inicio />} />} />
      )}
      {usuario?.rol === "Personal" && (
        <Route
          path="/tarea/:id"
          element={<PrivateRoute element={<TareaAgente />} />}
        />
      )}
      {/* {usuario?.rol === "personal" && (
        <Route
          path="/mis-tareas"
          element={<PrivateRoute element={<MisTareas />} />}
        />
      )} */}

      {/* Otras rutas compartidas */}
      <Route path="/buscar" element={<PrivateRoute element={<Buscar />} />} />
      <Route
        path="/reportes"
        element={<PrivateRoute element={<Reportes />} isAdminRequired={true} />}
      />
      <Route
        path="/crear-tarea"
        element={
          <PrivateRoute element={<CrearTarea />} isAdminRequired={true} />
        }
      />
      <Route
        path="/tarea/:id"
        element={<PrivateRoute element={<TareaDetalles />} />}
      />
      <Route
        path="/mis-tareas"
        element={<PrivateRoute element={<MisTareas />} />}
      />

      {/* Ruta pública de login */}
      <Route
        path="/login"
        element={usuario ? <Navigate to="/inicio" /> : <Login />}
      />

      {/* Ruta por defecto */}
      <Route
        path="/*"
        element={
          usuario ? (
            usuario.rol === "Administrador" ? (
              <Navigate to="/inicio" /> // Redirige a InicioAdmin
            ) : (
              <Navigate to="/inicio" /> // Redirige a Inicio (para "Personal")
            )
          ) : (
            <Navigate to="/login" /> // Si no está autenticado, redirige al login
          )
        }
      />
    </Routes>
  );
};

export default AppRouter;

import { Routes, Route } from "react-router-dom";
import Inicio from "../pages/Inicio";
import Tareas from "../pages/Tareas";
import CrearTarea from "../pages/CrearTarea";

const paginas = [
  { path: "/", element: <Inicio /> },
  { path: "/tareas", element: <Tareas /> },
  { path: "/crear-tarea", element: <CrearTarea /> },
];

//{ path: '/reportes', element: <Reportes /> },

const AppRouter = () => {
  return (
    <Routes>
      {paginas.map((pagina, index) => (
        <Route key={index} path={pagina.path} element={pagina.element} />
      ))}
    </Routes>
  );
};

export default AppRouter;

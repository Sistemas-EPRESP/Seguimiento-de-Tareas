import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import Loading from "../layout/Loading";

const Menu = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado para el modal de carga
  const { usuario, logout } = useContext(AuthContext);

  const handleLogout = () => {
    setIsLoading(true); // Mostrar modal de carga

    setTimeout(() => {
      logout();
      setIsLoading(false); // Ocultar el modal de carga
      navigate("/login");
    }, 2000); // Simula un tiempo de carga de 2 segundos
  };

  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between fixed">
      <div>
        {isLoading && <Loading />}
        {usuario?.rol === "Administrador" ? (
          <>
            {/* Opciones para el rol Administrador */}
            <section>
              <h1 className="text-2xl mb-6">Principal</h1>
              <ul>
                <li className="mb-4">
                  <Link
                    to="/"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <HomeIcon className="mr-2" /> <span>Inicio</span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/buscar"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <SearchIcon className="mr-2" /> <span>Buscar</span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/mistareas"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <TaskIcon className="mr-2" /> <span>Mis tareas</span>
                  </Link>
                </li>
              </ul>
            </section>
            <section>
              <h1 className="text-2xl mb-6 mt-6">Información</h1>
              <ul>
                <li className="mb-4">
                  <Link
                    to="/reportes"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <AssessmentIcon className="mr-2" /> <span>Reportes</span>
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="/historial"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <HistoryIcon className="mr-2" /> <span>Historial</span>
                  </Link>
                </li>
              </ul>
            </section>
          </>
        ) : (
          // Opciones para el rol Personal
          <section>
            <ul>
              <li className="mb-4">
                <Link
                  to="/"
                  className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                >
                  <HomeIcon className="mr-2" /> <span>Inicio</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/mistareas"
                  className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                >
                  <SearchIcon className="mr-2" /> <span>Buscar</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/mistareas"
                  className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                >
                  <TaskIcon className="mr-2" /> <span>Mis tareas</span>
                </Link>
              </li>
            </ul>
          </section>
        )}
      </div>
      <section>
        <h1 className="text-2xl mb-6">Usuario</h1>
        <button
          onClick={handleLogout}
          className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
        >
          <PersonIcon className="mr-2" />
          <span>Cerrar sesión</span>
        </button>
      </section>
    </div>
  );
};

export default Menu;

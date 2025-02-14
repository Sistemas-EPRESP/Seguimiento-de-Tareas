import { Link, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import Loading from "../layout/Loading";
import Logo512 from "../img/Logo512.svg";

const Menu = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);
  const [cargando, setCargando] = useState(false);

  const handleLogout = () => {
    setCargando(true); // Mostrar modal de carga

    setTimeout(() => {
      logout();
      setCargando(false); // Ocultar el modal de carga
      navigate("/login");
    }, 1000); // Simula un tiempo de carga de 2 segundos
  };

  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between fixed">
      <div>
        <div className="flex flex-col items-center mt-2 mb-8">
          <div className="bg-gray-700 rounded-full flex justify-center items-center h-[200px] w-[200px]">
            <img src={Logo512} className="h-[180px] pr-4" alt="Logo" />
          </div>
        </div>
        <Loading isVisible={cargando} />
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
                    to="/crear-tarea"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <AddIcon className="mr-2" /> <span>Crear tarea</span>
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
                    to="/mis-tareas"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <TaskIcon className="mr-2" /> <span>Mis tareas</span>
                  </Link>
                </li>
              </ul>
            </section>
            <section>
              <h1 className="text-2xl mb-6">Información</h1>
              <ul>
                <li className="mb-4">
                  <Link
                    to="/reportes"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
                  >
                    <AssessmentIcon className="mr-2" /> <span>Reportes</span>
                  </Link>
                </li>
              </ul>
            </section>
          </>
        ) : (
          // Opciones para el rol Personal
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
                  to="/mis-tareas"
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

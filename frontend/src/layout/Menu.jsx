import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Loading from "../layout/Loading";
import Logo512 from "../img/Logo512.svg";

const Menu = () => {
  const navigate = useNavigate();
  const { usuario, logout } = useContext(AuthContext);
  const [cargando, setCargando] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    setCargando(true);
    setTimeout(() => {
      logout();
      setCargando(false);
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Botón hamburguesa */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 text-white p-2 rounded"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Menú lateral */}
      <div
        ref={menuRef}
        className={`fixed h-screen bg-gray-800 text-white p-4 flex flex-col overflow-y-auto custom-scrollbar transition-transform md:translate-x-0 
        ${
          isOpen ? "translate-x-0 w-52 z-40" : "-translate-x-full w-64 md:z-40"
        } md:w-1/6`}
      >
        <div>
          <div className="flex flex-col items-center mt-2 mb-3">
            <div className="bg-gray-700 rounded-full flex justify-center items-center h-[130px] w-[130px] md:h-[160px] md:w-[160px]">
              <img
                src={Logo512}
                className="h-[130px] pr-4 md:h-[180px]"
                alt="Logo"
              />
            </div>
          </div>
          <Loading isVisible={cargando} />
          {usuario?.rol === "Administrador" ? (
            <>
              <section>
                <h1 className="text-xl mb-3 md:text-2xl">Principal</h1>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/"
                      className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <HomeIcon className="mr-2" /> <span>Inicio</span>
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/crear-tarea"
                      className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <AddIcon className="mr-2" /> <span>Crear tarea</span>
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/buscar"
                      className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <SearchIcon className="mr-2" /> <span>Buscar</span>
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link
                      to="/mis-tareas"
                      className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <TaskIcon className="mr-2" /> <span>Mis tareas</span>
                    </Link>
                  </li>
                </ul>
              </section>
              <section>
                <h1 className="text-xl mb-3 md:text-2xl">Información</h1>
                <ul>
                  <li className="mb-2">
                    <Link
                      to="/reportes"
                      className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                      onClick={() => setIsOpen(false)}
                    >
                      <AssessmentIcon className="mr-2" /> <span>Reportes</span>
                    </Link>
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <section>
              <h1 className="text-xl mb-4 md:text-2xl">Principal</h1>
              <ul>
                <li className="mb-2">
                  <Link
                    to="/"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <HomeIcon className="mr-2" /> <span>Inicio</span>
                  </Link>
                </li>
                <li className="mb-2">
                  <Link
                    to="/mis-tareas"
                    className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <TaskIcon className="mr-2" /> <span>Mis tareas</span>
                  </Link>
                </li>
              </ul>
            </section>
          )}
        </div>
        <section className="mt-auto">
          <h1 className="text-xl mb-2 md:text-2xl">Usuario</h1>
          <button
            onClick={handleLogout}
            className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2 w-full"
          >
            <PersonIcon className="mr-2" />
            <span>Cerrar sesión</span>
          </button>
        </section>
      </div>
    </>
  );
};

export default Menu;

import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import TaskIcon from "@mui/icons-material/Task";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import HistoryIcon from "@mui/icons-material/History";

const Menu = () => {
  return (
    <div className="w-1/6 h-screen bg-gray-800 text-white p-4 flex flex-col justify-between fixed">
      <div>
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
                to="/tareas"
                className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
              >
                <TaskIcon className="mr-2" /> <span>Tareas</span>
              </Link>
            </li>
          </ul>
        </section>
        <section>
          <h1 className="text-2xl mb-6">Información</h1>
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
              >
                <AssessmentIcon className="mr-2" /> <span>Reportes</span>
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/tareas"
                className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full"
              >
                <HistoryIcon className="mr-2" /> <span>Historial</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
      <section>
        <h1 className="text-2xl mb-6">Usuario</h1>
        <button className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-4 py-2 w-full">
          <PersonIcon className="mr-2" />
          <span>Cerrar sesión</span>
        </button>
      </section>
    </div>
  );
};

export default Menu;

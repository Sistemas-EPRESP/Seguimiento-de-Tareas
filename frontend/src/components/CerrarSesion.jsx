import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";
import { Logout } from "@mui/icons-material";

function CerrarSesion({ setCargando }) {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCargando(true);
    setTimeout(() => {
      logout();
      setCargando(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <section className="mt-auto bg-gray-800 rounded-xl p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-gray-100">
          <PersonIcon className="w-5 h-5 text-blue-400" />
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-nowrap">
              {usuario.agente.nombre + " " + usuario.agente.apellido}{" "}
            </h1>
            <span className="text-sm text-gray-400 font-normal italic">
              {usuario.rol}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Cerrar sesión"
          className="flex items-center py-2 text-sm md:px-2 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <Logout className=" w-2 h-2" />
        </button>
      </div>
    </section>
  );
}

CerrarSesion.propTypes = {
  setCargando: PropTypes.func,
};
export default CerrarSesion;

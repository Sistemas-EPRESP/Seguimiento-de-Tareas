import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import PropTypes from "prop-types";

function CerrarSesion({ setCargando }) {
  const { usuario, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  console.log("usuario: ", usuario);

  const handleLogout = () => {
    setCargando(true);
    setTimeout(() => {
      logout();
      setCargando(false);
      navigate("/login");
    }, 1000);
  };

  return (
    <section className="mt-auto">
      <h1 className=" mb-2 md:text-lg">
        {usuario.agente.nombre + " " + usuario.agente.apellido}
      </h1>
      <button
        onClick={handleLogout}
        className="hover:bg-gray-600 bg-gray-700 flex items-center rounded px-3 py-2 w-full"
      >
        <PersonIcon className="mr-2" />
        <span>Cerrar sesión</span>
      </button>
    </section>
  );
}

CerrarSesion.propTypes = {
  setCargando: PropTypes.func,
};
export default CerrarSesion;

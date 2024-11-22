import { useState, useContext } from "react";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../layout/Loading.jsx";
import ModalInformativo from "../layout/ModalInformativo.jsx";

const Login = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useContext(AuthContext); // Para establecer el usuario logueado
  const [error, setError] = useState(null);
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setCargando(true);
    e.preventDefault();

    // Separar el nombre completo
    const [nombre, apellido] = nombreCompleto.split(" ");

    try {
      const { data } = await axios.post(`${config.apiUrl}/login`, {
        nombre,
        apellido,
        password,
      }); // Enviar datos de login al backend
      localStorage.setItem("token", data.token); // El token devuelto desde el backend
      localStorage.setItem("userId", data.agente.id);
      setUsuario(data); // Guardar al usuario en el contexto
      setCargando(false);
      navigate("/"); // Redirigir a la página principal o a donde desees
    } catch (error) {
      setCargando(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Error",
        titulo: "Error al iniciar sesión",
        mensaje: "No se obtuvo una respuesta del servidor, intente mas tarde.",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center size-full">
      <div className="grid grid-col-1 w-[425px] bg-gray-800 p-4 rounded-lg gap-4">
        <h1 className="flex justify-center text-3xl ">Iniciar Sesión</h1>
        <form className="grid grid-col-1 gap-4" onSubmit={handleLogin}>
          <div className="grid gap-1">
            <label>Nombre y Apellido</label>
            <input
              type="nombre"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>
          <div className="grid gap-1">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Ingresar
          </button>
        </form>
      </div>
      {cargando && <Loading />}
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

export default Login;

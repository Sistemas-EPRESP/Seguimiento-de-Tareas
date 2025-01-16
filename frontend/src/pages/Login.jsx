import { useState, useContext, useEffect } from "react";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../layout/Loading.jsx";
import ModalInformativo from "../layout/ModalInformativo.jsx";

const Login = () => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Recordar usuario y contraseña
  const [cargando, setCargando] = useState(false);
  const { setUsuario } = useContext(AuthContext); // Para establecer el usuario logueado
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
  const navigate = useNavigate();

  // Cargar nombre completo y contraseña almacenados al cargar la página
  useEffect(() => {
    const rememberedUser = localStorage.getItem("rememberedUser");
    const rememberedPassword = localStorage.getItem("rememberedPassword");

    if (rememberedUser) {
      setNombreCompleto(rememberedUser);
      setRememberMe(true);
    }
    if (rememberedPassword) {
      setPassword(rememberedPassword); // Cargar la contraseña directamente
    }
  }, []);

  const handleLogin = async (e) => {
    setCargando(true);
    e.preventDefault();

    // Separar el nombre completo
    const [nombre, apellido] = nombreCompleto.split(" ");

    try {
      const { data } = await axios.post(`${config.apiUrl}/login`, {
        nombre: nombre.toLowerCase(),
        apellido: apellido.toLowerCase(),
        password,
      }); // Enviar datos de login al backend

      localStorage.setItem("token", data.token); // El token devuelto desde el backend
      localStorage.setItem("userId", data.agente.id);

      // Guardar usuario y contraseña si se seleccionó "Recordarme"
      if (rememberMe) {
        localStorage.setItem("rememberedUser", nombreCompleto);
        localStorage.setItem("rememberedPassword", password); // Almacenar la contraseña sin encriptar
      } else {
        localStorage.removeItem("rememberedUser");
        localStorage.removeItem("rememberedPassword");
      }

      setUsuario(data); // Guardar al usuario en el contexto
      setCargando(false);
      navigate("/"); // Redirigir a la página principal o a donde desees
    } catch (error) {
      setCargando(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Error",
        titulo: "Error al iniciar sesión",
        mensaje: error.response.data.message,
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
              type="text"
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
          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="rememberMe">Recordarme</label>
          </div>
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

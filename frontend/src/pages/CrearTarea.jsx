import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API
import CloseIcon from "@mui/icons-material/Close";
import SelectAgente from "../components/SelectAgente.jsx";
import ModalInformativo from "../layout/ModalInformativo";
import Loading from "../layout/Loading";

export default function CrearTareas() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    agenteSeleccionado: "",
    agentesSeleccionados: [],
    fecha_inicio: null,
    fecha_de_entrega: null,
    fecha_limite: null,
    fecha_vencimiento: null,
    descripcion: "",
    prioridad: "",
    estado: "",
  });
  const [agentes, setAgentes] = useState([]);

  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
  const [loadingOpen, setLoadingOpen] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerAgentes = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/agentes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAgentes(data);
      } catch (error) {
        console.error("Error al obtener los agentes", error);
      }
    };

    obtenerAgentes();
  }, [token]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAgregarAgente = () => {
    const agenteSeleccionado = agentes.find(
      (agente) => agente.id === parseInt(formData.agenteSeleccionado)
    );

    if (
      agenteSeleccionado &&
      !formData.agentesSeleccionados.includes(agenteSeleccionado)
    ) {
      setFormData((prevData) => ({
        ...prevData,
        agentesSeleccionados: [
          ...prevData.agentesSeleccionados,
          agenteSeleccionado,
        ],
        agenteSeleccionado: "",
      }));
    }
  };

  const handleEliminarAgente = (id) => {
    setFormData((prevData) => ({
      ...prevData,
      agentesSeleccionados: prevData.agentesSeleccionados.filter(
        (agente) => agente.id !== id
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    if (!token) {
      console.error("No hay token disponible");
      return;
    }
    const agentesIds = formData.agentesSeleccionados.map((agente) => agente.id);

    const { agentesSeleccionados, agenteSeleccionado, ...formDataSinExtras } =
      formData;

    const formattedData = {
      ...formDataSinExtras,
      fecha_inicio: formData.fecha_inicio
        ? format(formData.fecha_inicio, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      fecha_de_entrega: formData.fecha_de_entrega
        ? format(formData.fecha_de_entrega, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      fecha_limite: formData.fecha_limite
        ? format(formData.fecha_limite, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      fecha_vencimiento: formData.fecha_vencimiento
        ? format(formData.fecha_vencimiento, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      agentesIds,
    };

    try {
      await axios.post(`${config.apiUrl}/tareas`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalInfo({
        tipo: "Exito",
        titulo: "Tarea Creada!",
        mensaje: "¡Tarea creada con éxito!",
      });
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Error al crear la tarea",
        mensaje: "Ocurrió un error inesperado al crear la tarea",
      });
    } finally {
      await sleep(2000);
      setLoadingOpen(false);
      setModalVisible(true);
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <div className="flex justify-center items-center mt-10 px-60 ">
      <div className=" w-3/4 bg-gray-800 text-gray-100 rounded-lg p-8 shadow-2xl">
        <h1 className="text-4xl mb-6 text-center">Crear Tarea</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Agentes:</label>
            <div className="flex items-center ">
              <SelectAgente
                agentes={agentes}
                value={formData.agenteSeleccionado}
                onChange={(selectedValue) =>
                  handleChange("agenteSeleccionado", selectedValue)
                }
                className={
                  "w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                }
              />
              <button
                type="button"
                onClick={handleAgregarAgente}
                className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Añadir
              </button>
            </div>

            <div className="flex flex-wrap mt-3 gap-3">
              {formData.agentesSeleccionados.length > 0 ? (
                formData.agentesSeleccionados.map((agente) => (
                  <div
                    key={agente.id}
                    className="flex items-center bg-gray-600 text-sm rounded-md px-3 gap-2"
                  >
                    <span>{`${agente.nombre} ${agente.apellido}`}</span>
                    <button
                      type="button"
                      onClick={() => handleEliminarAgente(agente.id)}
                      className="text-slate-500 hover:text-slate-600"
                    >
                      <CloseIcon style={{ width: "16px", color: "white" }} />
                    </button>
                  </div>
                ))
              ) : (
                <p>No hay agentes seleccionados.</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 ">
            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Inicio:
              </label>
              <DatePicker
                selected={formData.fecha_inicio}
                onChange={(date) => handleChange("fecha_inicio", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de inicio"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Entrega:
              </label>
              <DatePicker
                selected={formData.fecha_de_entrega}
                onChange={(date) => handleChange("fecha_de_entrega", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de entrega del agente"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha Limite:
              </label>
              <DatePicker
                selected={formData.fecha_limite}
                onChange={(date) => handleChange("fecha_limite", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de limite"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Vencimiento:
              </label>
              <DatePicker
                selected={formData.fecha_vencimiento}
                onChange={(date) => handleChange("fecha_vencimiento", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de vencimiento"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-100">
              Descripción:
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleChange("descripcion", e.target.value)}
              className="w-full px-3 py-2 min-h-10 max-h-60 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              rows="4"
            />
          </div>

          <div className="flex gap-5">
            <div className="w-1/2">
              <Select
                label="Prioridad"
                opciones={["Alta", "Media", "Baja", "Periódica"]}
                onChange={(value) => handleChange("prioridad", value)}
                value={formData.prioridad}
                placeHolder={"Seleccione la prioridad"}
                labelClassName="block text-sm font-medium mb-1 text-gray-100"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
            </div>

            <div className="w-1/2">
              <Select
                label="Estado"
                opciones={["Sin comenzar", "Bloqueado"]}
                onChange={(value) => handleChange("estado", value)}
                value={formData.estado}
                placeHolder={"Seleccione un estado"}
                labelClassName="block text-xl font-medium mb-1 text-gray-100"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      <div>
        {modalVisible && (
          <ModalInformativo
            modalInfo={modalInfo}
            onClose={() => setModalVisible(false)} // Pasar la función de cierre
          />
        )}
        {loadingOpen && <Loading />}
      </div>
    </div>
  );
}

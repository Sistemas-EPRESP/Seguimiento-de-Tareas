import { useEffect, useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { isToday, isThisWeek, parseISO, isFuture, addDays } from "date-fns";
import TareaCard from "../components/TareaCard.jsx";
import Filtro from "../layout/Filtro.jsx";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API
import { AuthContext } from "../context/AuthContext";
import useApiGet from "../hooks/useApiGet.js";

export default function Inicio() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  const [tareas, setTareas] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [futureTasks, setFutureTasks] = useState([]);
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [agenteFiltro, setAgenteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const { result, loading, error } = useApiGet(`/agentes`);
  const agentes = result;

  const obtenerTareas = async () => {
    const token = localStorage.getItem("token");
    const idAgente = -1; // Obtienes el ID del agente

    if (!token) {
      console.error("No hay token disponible");
      return;
    }
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    try {
      // Pasamos el ID como query string
      const { data } = await axios.get(`${config.apiUrl}/tareas/incompletas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          idAgente, // Esto será enviado como ?idAgente=valor
        },
      });
      setTareas(data);
    } catch (error) {
      console.error(
        "Error al obtener las tareas",
        error.response?.data || error
      );
    }
  };

  const filtrarTareas = useCallback(
    (tarea) => {
      const agenteCoincide =
        !agenteFiltro ||
        tarea.Agentes.some(
          (agente) => `${agente.nombre} ${agente.apellido}` === agenteFiltro
        );

      return (
        (!prioridadFiltro || tarea.prioridad === prioridadFiltro) &&
        agenteCoincide && // Verificamos si algún agente coincide
        (!estadoFiltro || tarea.estado === estadoFiltro)
      );
    },
    [prioridadFiltro, agenteFiltro, estadoFiltro]
  );

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="container mx-auto px-1">
      <div className="flex flex-col items-end md:flex-row justify-between  md:items-center border-b-2 border-b-slate-500 mb-4 pb-4">
        <h1 className="text-xl md:text-3xl font-semibold mb-4 md:mb-0">
          Hola {usuario?.agente?.nombre} {usuario?.agente?.apellido}!
        </h1>
        <div className="flex flex-row md:gap-0 gap-1 md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <h2 className="flex items-center">Filtrar por: </h2>
          <Filtro
            opciones={["Alta", "Media", "Baja", "Periódica"]}
            onChange={(value) => setPrioridadFiltro(value)}
            placeHolder={"Prioridad"}
            labelClassName=""
            selectClassName="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
          />
          <Filtro
            opciones={
              loading
                ? []
                : [
                    ...new Set(
                      agentes.map(
                        (agente) => `${agente.nombre} ${agente.apellido}`
                      ) // Retorna solo la cadena de nombre completo
                    ),
                  ]
            }
            onChange={(value) => setAgenteFiltro(value)}
            placeHolder={"Agentes"}
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
          <Filtro
            opciones={[
              "Sin comenzar",
              "Curso",
              "Bloqueada",
              "Corrección",
              "Revisión",
              "Finalizado",
            ]}
            placeHolder={"Estado"}
            onChange={(value) => setEstadoFiltro(value)}
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
        </div>
      </div>
      <h1 className="text-3xl mb-6">Tareas activas</h1>
      <ul className="mb-8">
        {tareas.length > 0 ? (
          tareas
            .filter(filtrarTareas)
            .map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
        ) : (
          <p className="text-gray-500 mb-8">No hay tareas disponibles.</p>
        )}
      </ul>

      <button
        onClick={() => navigate("/crear-tarea")}
        className="fixed bottom-8 right-8 z-40 bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <div className="flex items-center">
          <AddCircleOutlineIcon />
          <span className=" ml-2">Crear Tarea</span>
        </div>
      </button>
    </div>
  );
}

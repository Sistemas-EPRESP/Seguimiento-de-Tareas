import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { isToday, isThisWeek } from "date-fns";
import TareaCard from "../components/TareaCard";
import Filtro from "../layout/Filtro";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import config from "../api/config.js"; // Importa la configuración de la API

export default function Inicio() {
  const navigate = useNavigate();

  const [tareas, setTareas] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [agenteFiltro, setAgenteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const obtenerTareas = async () => {
    const today = new Date();
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    try {
      const { data } = await axios.get(`${config.apiUrl}/tareas/fecha`, {
        params: {
          fechaInicio: today.toISOString().split("T")[0],
          fechaFin: oneWeekFromNow.toISOString().split("T")[0],
        },
      });

      setTareas(data);
    } catch (error) {
      console.error("Error al obtener las tareas", error);
    }
  };

  const filtrarTareas = useCallback(
    (tarea) => {
      return (
        (!prioridadFiltro || tarea.prioridad === prioridadFiltro) &&
        (!agenteFiltro || tarea.agente === agenteFiltro) &&
        (!estadoFiltro || tarea.estado === estadoFiltro)
      );
    },
    [prioridadFiltro, agenteFiltro, estadoFiltro]
  );

  useEffect(() => {
    const tareasHoy = tareas.filter(
      (tarea) =>
        isToday(new Date(tarea.fecha_vencimiento)) && filtrarTareas(tarea)
    );
    const tareasSemana = tareas.filter(
      (tarea) =>
        isThisWeek(new Date(tarea.fecha_vencimiento)) &&
        !isToday(new Date(tarea.fecha_vencimiento)) &&
        filtrarTareas(tarea)
    );

    setTodayTasks(tareasHoy);
    setWeekTasks(tareasSemana);
  }, [tareas, filtrarTareas]);

  useEffect(() => {
    obtenerTareas();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-700 text-gray-100 relative">
      <div className="flex justify-end space-x-4 mb-6">
        <Filtro
          label="Prioridad"
          opciones={["Alta", "Media", "Baja", "Periódica"]}
          onChange={(value) => setPrioridadFiltro(value)}
          labelClassName="block text-sm font-medium mb-1 text-gray-100"
          selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
        />
        <Filtro
          label="Agente"
          opciones={[...new Set(tareas.map((tarea) => tarea.agente))]}
          onChange={(value) => setAgenteFiltro(value)}
          labelClassName="block text-sm font-medium mb-1 text-gray-100"
          selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
        />
        <Filtro
          label="Estado"
          opciones={[
            "Sin comenzar",
            "En curso",
            "Bloqueado",
            "Completado",
            "En revisión",
          ]}
          onChange={(value) => setEstadoFiltro(value)}
          labelClassName="block text-sm font-medium mb-1 text-gray-100"
          selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
        />
      </div>

      <h1 className="text-3xl mb-6">Tareas para Hoy</h1>
      <ul className="mb-8">
        {todayTasks.length > 0 ? (
          todayTasks.map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
        ) : (
          <p>No hay tareas para hoy.</p>
        )}
      </ul>

      <h1 className="text-3xl mb-6">Tareas para esta Semana</h1>
      <ul>
        {weekTasks.length > 0 ? (
          weekTasks.map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
        ) : (
          <p>No hay tareas para esta semana.</p>
        )}
      </ul>

      <button
        onClick={() => navigate("/crear-tarea")}
        className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-lg hover:bg-blue-700 transition-colors"
      >
        <div className="flex items-center">
          <AddCircleOutlineIcon />
          <span className="ml-2">Crear Tarea</span>
        </div>
      </button>
    </div>
  );
}

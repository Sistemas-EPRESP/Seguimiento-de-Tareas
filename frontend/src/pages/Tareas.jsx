import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import config from "../api/config";
import "react-datepicker/dist/react-datepicker.css";
import Filtro from "../layout/Filtro";
import TareaCard from "../components/TareaCard";
import Loading from "../layout/Loading";

export default function Tareas() {
  const [query, setQuery] = useState("");
  const [agentes, setAgentes] = useState([]);
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [agenteFiltro, setAgenteFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [tareas, setTareas] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(false);

  useEffect(() => {
    const obtenerAgentes = async () => {
      const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
      try {
        const { data } = await axios.get(`${config.apiUrl}/agentes`, {
          headers: {
            Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
          },
        });
        setAgentes(data);
      } catch (error) {
        console.error("Error al obtener los agentes", error);
      }
    };
    obtenerAgentes();
  }, [agentes]);

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
        agenteCoincide &&
        (!estadoFiltro || tarea.estado === estadoFiltro)
      );
    },
    [prioridadFiltro, agenteFiltro, estadoFiltro]
  );

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleBuscar = async () => {
    setLoadingOpen(true);
    const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
    try {
      const { data } = await axios.get(`${config.apiUrl}/tareas/buscar`, {
        params: { q: query },
        headers: {
          Authorization: `Bearer ${token}`, // Incluir el token en el encabezado
        },
      });
      await sleep(2000);
      setLoadingOpen(false);
      setTareas(data);
    } catch (error) {
      console.error("Error al buscar tareas", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Buscador de Tareas</h1>
      <div className="grid grid-cols-2 border-b-2 border-b-slate-500 mb-4">
        <div className="">
          <input
            className="w-2/3 px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            placeholder="Nombre, agente o fecha (YYYY-MM-DD)"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="bg-blue-500 rounded-xl py-2 px-4 hover:bg-blue-600 ml-2"
            onClick={handleBuscar}
          >
            Buscar
          </button>
        </div>
        <div className="flex justify-end space-x-4 mb-6">
          <h2 className="flex items-center ">Filtrar por:</h2>
          <Filtro
            opciones={["Alta", "Media", "Baja", "Periódica"]}
            onChange={(value) => setPrioridadFiltro(value)}
            placeHolder={"Prioridad"}
            labelClassName=""
            selectClassName="w-full px-3 py-2 bg-gray-800 text-white rounded-lg focus:outline-none"
          />
          <Filtro
            opciones={[
              ...new Set(
                agentes.map((agente) => `${agente.nombre} ${agente.apellido}`)
              ),
            ]}
            onChange={(value) => setAgenteFiltro(value)}
            placeHolder={"Agentes"}
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
          <Filtro
            opciones={[
              "Sin comenzar",
              "En curso",
              "Bloqueado",
              "Completa",
              "En revisión",
            ]}
            placeHolder={"Estado"}
            onChange={(value) => setEstadoFiltro(value)}
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
        </div>
      </div>
      <div>
        <ul className="mb-8">
          {tareas.length > 0 ? (
            tareas
              .filter(filtrarTareas)
              .map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
          ) : (
            <p>No hay tareas para hoy.</p>
          )}
        </ul>
      </div>
      {loadingOpen && <Loading />}
    </div>
  );
}

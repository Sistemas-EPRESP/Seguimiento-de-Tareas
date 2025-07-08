import { useEffect, useState, useCallback } from "react";
import { api } from "../api/api";
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
  const [hasSearched, setHasSearched] = useState(false); // Nuevo estado

  useEffect(() => {
    const obtenerAgentes = async () => {
      try {
        const { data } = await api.get(`/agentes`);
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
    try {
      const { data } = await api.get(`/tareas/buscar`);
      await sleep(2000);
      setLoadingOpen(false);

      setTareas(data);
      setHasSearched(true); // Actualizar estado después de realizar la búsqueda
    } catch (error) {
      console.error("Error al buscar tareas", error);
      setLoadingOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBuscar();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-end md:flex md:flex-col md:items-stretch ">
        <h1 className="text-2xl md:text-3xl font-semibold mb-4">
          Buscador de Tareas
        </h1>

        <div className="flex flex-col gap-2 md:gap-0 md:grid md:grid-cols-2 border-b-2 border-b-slate-500 mb-4">
          <div className="">
            <input
              className="w-2/3 px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
              placeholder="Nombre de tarea o agente"
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-blue-500 w:1/4 md:w-1/6 rounded-xl py-2 px-4 hover:bg-blue-600 ml-2"
              onClick={handleBuscar}
            >
              Buscar
            </button>
          </div>
          <div className="flex md:justify-end md:gap-0 gap-1 md:space-x-4 mb-6">
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
                "Curso",
                "Bloqueado",
                "Revisión",
                "Finalizado",
              ]}
              placeHolder={"Estado"}
              onChange={(value) => setEstadoFiltro(value)}
              selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>
        </div>
      </div>
      <div>
        <ul className="mb-8">
          {
            tareas.length > 0
              ? tareas
                  .filter(filtrarTareas)
                  .map((tarea) => <TareaCard key={tarea.id} tarea={tarea} />)
              : hasSearched && <p>No se encontraron tareas con ese criterio.</p> // Mostrar solo si se ha buscado
          }
        </ul>
      </div>
      {loadingOpen && <Loading isVisible={true} />}
    </div>
  );
}

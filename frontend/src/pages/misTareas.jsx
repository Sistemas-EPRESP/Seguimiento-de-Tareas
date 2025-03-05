import { useEffect, useState, useCallback, useContext } from "react";
import axios from "axios";
import config from "../api/config.js";
import { AuthContext } from "../context/AuthContext";
import Filtro from "../layout/Filtro.jsx";
import Loading from "../layout/Loading.jsx";
import TareaCard from "../components/TareaCard.jsx";
import TareaCardAgente from "../components/TareaCardAgente.jsx";

export default function MisTareas() {
  const { usuario } = useContext(AuthContext);
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [agente, setAgente] = useState({});
  const [cargando, setCargando] = useState(false);
  const [tareas, setTareas] = useState([]);
  const [filtro, setFiltro] = useState("");

  const filtrarTareas = useCallback(
    (tarea) => {
      return (
        (!prioridadFiltro || tarea.prioridad === prioridadFiltro) &&
        (!estadoFiltro || tarea.estado === estadoFiltro) &&
        tarea.nombre.toLowerCase().includes(filtro.toLowerCase())
      );
    },
    [prioridadFiltro, estadoFiltro, filtro]
  );

  useEffect(() => {
    const fetchTareas = async () => {
      setCargando(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const { data } = await axios.get(`${config.apiUrl}/tareas/agente`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            idAgente: userId, // Esto será enviado como ?idAgente=valor
          },
        });

        setTareas(data);
        const resp = await axios.get(`${config.apiUrl}/agentes/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAgente(resp.data);
      } catch (error) {
        console.error("Error al obtener las tareas", error);
      } finally {
        setCargando(false);
      }
    };

    fetchTareas();
  }, [usuario.agente.id]);

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };

  const tareasFiltradas = tareas.filter(filtrarTareas);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-semibold mb-4">Mis tareas</h1>
      <div className="grid grid-cols-2 border-b-2 border-b-slate-500 mb-4">
        <div className="">
          <input
            className="w-2/3 px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            placeholder="Filtro por titulo"
            value={filtro}
            onChange={handleFiltroChange}
          />
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
      <div className="grid grid-cols-1 gap-4">
        {tareasFiltradas.map((tarea) =>
          agente?.usuario?.rol === "Administrador" ? (
            <TareaCard key={tarea.id} tarea={tarea} />
          ) : (
            <TareaCardAgente key={tarea.id} tarea={tarea} />
          )
        )}
      </div>
      {cargando && <Loading />}
      {tareas.length === 0 && (
        <p className="text-white mb-8">No tienes tareas.</p>
      )}
    </div>
  );
}

import { useEffect, useState, useCallback, useContext } from "react";
import { isToday, isThisWeek, parseISO, isFuture, addDays } from "date-fns";
import Filtro from "../layout/Filtro.jsx";
import axios from "axios";
import config from "../api/config.js";
import { AuthContext } from "../context/AuthContext";
import Loading from "../layout/Loading.jsx";
import TareaCardAgente from "../components/TareaCardAgente.jsx";

export default function Inicio() {
  const { usuario } = useContext(AuthContext);
  const [todayTasks, setTodayTasks] = useState([]);
  const [weekTasks, setWeekTasks] = useState([]);
  const [futureTasks, setFutureTasks] = useState([]);
  const [prioridadFiltro, setPrioridadFiltro] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const filtrarTareas = useCallback(
    (tarea) => {
      return (
        (!prioridadFiltro || tarea.prioridad === prioridadFiltro) &&
        (!estadoFiltro || tarea.estado === estadoFiltro)
      );
    },
    [prioridadFiltro, estadoFiltro]
  );

  useEffect(() => {
    const fetchTareas = async () => {
      setCargando(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      try {
        const { data } = await axios.get(
          `${config.apiUrl}/tareas/incompletas`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              idAgente: userId, // Esto será enviado como ?idAgente=valor
            },
          }
        );
        setTareas(data);
      } catch (error) {
        console.error("Error al obtener las tareas", error);
      } finally {
        setCargando(false);
      }
    };

    fetchTareas();
  }, [usuario.agente.id]);

  // useEffect(() => {
  //   const hoy = new Date();
  //   const finDeSemana = addDays(hoy, 7);

  //   const tareasHoy = tareas.filter(
  //     (tarea) =>
  //       isToday(parseISO(tarea.fecha_de_entrega)) && filtrarTareas(tarea)
  //   );

  //   const tareasSemana = tareas.filter(
  //     (tarea) =>
  //       isThisWeek(parseISO(tarea.fecha_de_entrega)) &&
  //       !isToday(parseISO(tarea.fecha_de_entrega)) &&
  //       filtrarTareas(tarea)
  //   );

  //   const tareasFuturas = tareas.filter(
  //     (tarea) =>
  //       parseISO(tarea.fecha_de_entrega) > finDeSemana && filtrarTareas(tarea)
  //   );

  //   setTodayTasks(tareasHoy);
  //   setWeekTasks(tareasSemana);
  //   setFutureTasks(tareasFuturas);
  // }, [tareas, filtrarTareas]);

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-2 border-b-slate-500 mb-4 pb-4">
        <h1 className="text-3xl font-semibold mb-4 md:mb-0">
          Hola {usuario?.agente?.nombre} {usuario?.agente?.apellido}!
        </h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
          <h2 className="flex items-center">Filtrar por: </h2>
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
              "Completa",
              "Revisión",
              "Corrección",
            ]}
            placeHolder={"Estado"}
            onChange={(value) => setEstadoFiltro(value)}
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
        </div>
      </div>
      {cargando ? (
        <Loading />
      ) : (
        <div>
          <h2 className="text-3xl mb-6">Tareas</h2>
          {tareas.length > 0 ? (
            <ul className="space-y-4 mb-8">
              {tareas.map((tarea) => (
                <li key={tarea.id}>
                  <TareaCardAgente tarea={tarea} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 mb-8">No hay tareas.</p>
          )}
        </div>
        //   <div>
        //     <h2 className="text-3xl mb-6">Tareas para Hoy</h2>
        //     {todayTasks.length > 0 ? (
        //       <ul className="space-y-4 mb-8">
        //         {todayTasks.map((tarea) => (
        //           <li key={tarea.id}>
        //             <TareaCardAgente tarea={tarea} />
        //           </li>
        //         ))}
        //       </ul>
        //     ) : (
        //       <p className="text-gray-500 mb-8">No hay tareas para hoy.</p>
        //     )}

        //     <h2 className="text-3xl mb-6">Tareas para la semana</h2>
        //     {weekTasks.length > 0 ? (
        //       <ul className="space-y-4 mb-8">
        //         {weekTasks.map((tarea) => (
        //           <li key={tarea.id}>
        //             <TareaCardAgente tarea={tarea} />
        //           </li>
        //         ))}
        //       </ul>
        //     ) : (
        //       <p className="text-gray-500 mb-8">
        //         No hay tareas para esta semana.
        //       </p>
        //     )}

        //     <h2 className="text-3xl mb-6">Tareas posteriores</h2>
        //     {futureTasks.length > 0 ? (
        //       <ul className="space-y-4">
        //         {futureTasks.map((tarea) => (
        //           <li key={tarea.id}>
        //             <TareaCardAgente tarea={tarea} />
        //           </li>
        //         ))}
        //       </ul>
        //     ) : (
        //       <p className="text-gray-500 mb-8">No hay tareas futuras.</p>
        //     )}
        //   </div>
      )}
    </div>
  );
}

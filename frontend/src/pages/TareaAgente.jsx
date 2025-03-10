import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import config from "../api/config";
import Loading from "../layout/Loading";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RevisionesAgente from "../components/RevisionesAgente";
import ModalInformativo from "../layout/ModalInformativo";

export const TareaAgente = () => {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const [tarea, setTarea] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [botonFinalizarHabilitado, setBotonFinalizarHabilitado] =
    useState(false);
  const [botonComenzarHabilitado, setBotonComenzarHabilitado] = useState(false);
  const [actualizarTarea, setActualizarTarea] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal

  const priorityColor = {
    Alta: "bg-[#EF4444] text-white",
    Media: "bg-[#F59E0B] text-black",
    Baja: "bg-[#10B981] text-white",
    Periódica: "bg-[#3B82F6] text-white",
  };

  const statusColor = {
    "Sin comenzar": "bg-[#64748B] text-white",
    Curso: "bg-green-500 text-white",
    Corrección: "bg-blue-500 text-white",
    Revisión: "bg-[#F59E0B] text-black",
    Bloqueado: "bg-red-100 text-red-800",
    Finalizado: "bg-[#10B981] text-white",
  };

  const fetchTareaData = useCallback(async () => {
    setCargando(true);
    try {
      const { data } = await axios.get(`${config.apiUrl}/tareas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTarea(data);
      setBotonFinalizarHabilitado(verificarFinalizar(data));
      setBotonComenzarHabilitado(verificarComenzar(data));
    } catch (error) {
      console.error("Error al obtener los detalles de la tarea", error);
    } finally {
      setCargando(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchTareaData();
  }, [fetchTareaData, actualizarTarea]);

  const finalizarTarea = async (e) => {
    e.preventDefault();
    setCargando(true);
    var notificacion = {};
    if (tarea.estado === "Curso") {
      notificacion = {
        titulo: "Finalizacion de tarea",
        mensaje: "El agente indicó que finalizó la tarea",
      };
      setModalInfo({
        tipo: "Exito",
        titulo: "Operación exitosa",
        mensaje: "Haz finalizado la tarea!",
      });
    } else {
      notificacion = {
        titulo: "Finalizacion de correcciones",
        mensaje: "El agente indicó que finalizó las correcciones",
      };
      setModalInfo({
        tipo: "Exito",
        titulo: "Operación exitosa",
        mensaje: "Haz finalizado las correcciones!",
      });
    }
    try {
      const { data } = await axios.post(
        `${config.apiUrl}/tareas/${id}/notificar`,
        notificacion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      let historial = {};
      if (tarea.estado === "Curso") {
        historial = {
          tipo: "Finalización",
          descripcion: "El agente finalizó la tarea",
        };
      } else {
        historial = {
          tipo: "Finalización",
          descripcion: "El agente finalizó las correcciones",
        };
      }
      const resp = await axios.post(
        `${config.apiUrl}/tareas/${id}/historial`,
        historial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActualizarTarea((prev) => !prev);
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Operación fallida",
        mensaje: "No se pudo realizar esta acción!",
      });
    } finally {
      setCargando(false);
      setModalVisible(true);
    }
  };

  const verificarFinalizar = (tarea) => {
    if (tarea.estado === "Corrección" || tarea.estado === "Curso") {
      const notificacionesPendientes = tarea?.Notificacions?.some(
        (notificacion) => notificacion.estado === "Pendiente"
      );

      // Verificar si hay correcciones sin realizar
      const correccionesSinRealizar = tarea?.Revisions?.some((revision) =>
        revision.Correccions.some((correccion) => !correccion.estado)
      );

      // Verificar si no hay correcciones en estado "Corrección"
      const noHayCorrecciones =
        tarea.estado === "Corrección" &&
        (!tarea.Revisions || tarea.Revisions.length === 0);

      if (
        notificacionesPendientes ||
        noHayCorrecciones ||
        correccionesSinRealizar
      ) {
        return false;
      }

      return true;
    } else {
      return false;
    }
  };

  const verificarComenzar = (tarea) => {
    return tarea.estado === "Sin comenzar";
  };

  const comenzarTarea = async () => {
    setCargando(true);
    if (tarea.estado === "Sin comenzar") {
      const estado = { estado: "Curso" };
      try {
        const { data } = await axios.put(
          `${config.apiUrl}/tareas/${id}/cambiarEstado`,
          estado,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const historial = {
          tipo: "Inicio",
          descripcion: "El agente comenzó la tarea",
        };
        const resp = await axios.post(
          `${config.apiUrl}/tareas/${id}/historial`,
          historial,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setModalInfo({
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje: "Haz comenzado la tarea!",
        });
        setActualizarTarea((prev) => !prev);
      } catch (error) {
        console.error(error);
      } finally {
        setCargando(false);
        setModalVisible(true);
      }
    } else {
      setCargando(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Error",
        titulo: "Operación fallida",
        mensaje: "No se pudo realizar esta acción!",
      });
    }
  };

  const handleCorreccionesEnviadas = () => {
    fetchTareaData();
  };

  if (cargando || !tarea || !tarea.estado) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 ">
      <div
        id="Datos basicos"
        className="flex flex-col justify-between w-full md:w-3/4 h-auto md:h-[350px] gap-4 bg-gray-800 text-gray-100 rounded-lg p-6"
      >
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-2xl mb-2 md:mb-0 sm:text-3xl font-semibold">
              {tarea.nombre}
            </h1>
            <div className="flex items-start gap-2">
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  priorityColor[tarea.prioridad]
                }`}
              >
                {tarea.prioridad}
              </span>
              <span
                className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                  statusColor[tarea.estado]
                }`}
              >
                {tarea.estado}
              </span>
            </div>
          </div>
          <div className="text-gray-300 max-h-24 overflow-y-auto">
            {tarea.descripcion ? (
              <p>{tarea.descripcion}</p>
            ) : (
              <p className="text-gray-400 italic">No hay descripción.</p>
            )}
          </div>
          <span className="flex items-center gap-2">
            <CalendarTodayIcon style={{ width: "20px" }} />
            <label>Asignada:</label>
            <span>
              {tarea.fecha_inicio
                ? format(
                    new Date(tarea.fecha_inicio),
                    "EEEE, d 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    }
                  )
                : "Fecha no disponible"}
            </span>
          </span>
          <span className="flex items-center gap-2">
            <CalendarTodayIcon style={{ width: "20px" }} />
            <label>Fecha de entrega:</label>
            <span>
              {tarea.fecha_de_entrega
                ? format(
                    new Date(tarea.fecha_de_entrega),
                    "EEEE, d 'de' MMMM 'de' yyyy",
                    {
                      locale: es,
                    }
                  )
                : "Fecha no disponible"}
            </span>
          </span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <button
            onClick={comenzarTarea}
            disabled={!botonComenzarHabilitado}
            className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto ${
              !botonComenzarHabilitado ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <PlayCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
            <span>Comenzar</span>
          </button>

          <button
            onClick={finalizarTarea}
            disabled={!botonFinalizarHabilitado}
            className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto ${
              !botonFinalizarHabilitado ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CheckCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
            <span>Finalizar Tarea</span>
          </button>
        </div>
      </div>

      <RevisionesAgente
        tareaId={id}
        revisiones={tarea.Revisions}
        onCorreccionesEnviadas={handleCorreccionesEnviadas}
      />

      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)}
        />
      )}
    </div>
  );
};

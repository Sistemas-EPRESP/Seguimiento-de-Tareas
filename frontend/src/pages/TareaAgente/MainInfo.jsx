import { priorityColor, statusColor } from "./colors";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PropTypes from "prop-types";
import { api } from "../../api/api";
import { format } from "date-fns";
import { es } from "date-fns/locale";
function MainInfo({ state, dispatch, setActualizarTarea }) {
  const entregarTarea = async (e) => {
    e.preventDefault();
    dispatch({ type: "INICIA_ENTREGAR_TAREA" });
    let notificacion = {};
    if (state.tarea.estado === "Curso") {
      notificacion = {
        titulo: "Finalizacion de tarea",
        mensaje: "El agente indicó que finalizó la tarea",
      };
    } else {
      notificacion = {
        titulo: "Finalizacion de correcciones",
        mensaje: "El agente indicó que finalizó las correcciones",
      };
    }
    try {
      await api.post(`/tareas/${state.tarea.id}/notificar`, notificacion);
      let historial = {};
      if (state.tarea.estado === "Curso") {
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
      await api.post(`/tareas/${state.tarea.id}/historial`, historial);

      dispatch({ type: "EXITO_ENTREGA" });
      setActualizarTarea((prev) => !prev);
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_ENTREGA" });
    }
  };

  const comenzarTarea = async () => {
    dispatch({ type: "INICIA_COMENZAR_TAREA" });
    if (state.tarea.estado === "Sin comenzar") {
      const estado = { estado: "Curso" };
      try {
        await api.put(`/tareas/${state.tarea.id}/cambiarEstado`, estado);
        const historial = {
          tipo: "Inicio",
          descripcion: "El agente comenzó la tarea",
        };
        await api.post(`/tareas/${state.tarea.id}/historial`, historial);

        dispatch({ type: "EXITO_COMENZAR_TAREA" });
        setActualizarTarea((prev) => !prev);
      } catch (error) {
        dispatch({ type: "ERROR_COMENZAR_TAREA" });
        console.error(error);
      }
    } else {
      dispatch({ type: "ERROR_COMENZAR_TAREA" });
    }
  };

  return (
    <div
      id="Datos basicos"
      className="flex flex-col justify-between w-full md:w-3/4 h-auto md:h-[350px] gap-4 bg-gray-800 text-gray-100 rounded-lg p-6"
    >
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <h1 className="text-2xl mb-2 md:mb-0 sm:text-3xl font-semibold">
            {state.tarea.nombre}
          </h1>
          <div className="flex items-start gap-2">
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                priorityColor[state.tarea.prioridad]
              }`}
            >
              {state.tarea.prioridad}
            </span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                statusColor[state.tarea.estado]
              }`}
            >
              {state.tarea.estado}
            </span>
          </div>
        </div>
        <div className="text-gray-300 max-h-24 overflow-y-auto">
          {state.tarea.descripcion ? (
            <p>{state.tarea.descripcion}</p>
          ) : (
            <p className="text-gray-400 italic">No hay descripción.</p>
          )}
        </div>
        <span className="flex items-center gap-2">
          <CalendarTodayIcon style={{ width: "20px" }} />
          <label>Asignada:</label>
          <span>
            {state.tarea.fecha_inicio
              ? format(
                  new Date(state.tarea.fecha_inicio),
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
            {state.tarea.fecha_de_entrega
              ? format(
                  new Date(state.tarea.fecha_de_entrega),
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
          disabled={!state.botonComenzarHabilitado}
          className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto ${
            !state.botonComenzarHabilitado
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <PlayCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
          <span>Comenzar</span>
        </button>
        <button
          onClick={entregarTarea}
          disabled={!state.botonFinalizarHabilitado}
          className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto ${
            !state.botonFinalizarHabilitado
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <CheckCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
          <span>Entregar tarea</span>
        </button>
      </div>
    </div>
  );
}

MainInfo.propTypes = {
  state: PropTypes.object.required,
  dispatch: PropTypes.func.required,
  setActualizarTarea: PropTypes.func,
};

export default MainInfo;

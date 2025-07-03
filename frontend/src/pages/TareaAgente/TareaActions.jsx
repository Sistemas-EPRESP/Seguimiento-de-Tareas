import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { api } from "../../api/api";
import PropTypes from "prop-types";

function TareaActions({ state, dispatch, setActualizarTarea }) {
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

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
      <button
        onClick={comenzarTarea}
        disabled={!state.botonComenzarHabilitado}
        className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto ${
          !state.botonComenzarHabilitado ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <PlayCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
        <span>Comenzar</span>
      </button>
      <button
        onClick={entregarTarea}
        disabled={!state.botonFinalizarHabilitado}
        className={`flex justify-center items-center py-2 px-6 gap-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white w-full sm:w-auto ${
          !state.botonFinalizarHabilitado ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <CheckCircleOutlineIcon style={{ width: "20px", height: "20px" }} />
        <span>Entregar tarea</span>
      </button>
    </div>
  );
}

TareaActions.propTypes = {
  state: PropTypes.object.required,
  dispatch: PropTypes.func.required,
  setActualizarTarea: PropTypes.func,
};
export default TareaActions;

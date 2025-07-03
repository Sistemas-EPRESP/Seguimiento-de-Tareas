import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useReducer } from "react";
import { api } from "../../api/api";
import Loading from "../../layout/Loading";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RevisionesAgente from "../../components/RevisionesAgente";
import ModalInformativo from "../../layout/ModalInformativo";
import ModalNotificacion from "../../layout/ModalNotificacion";
import { tareaAgenteReducer, initialState } from "./tareaAgenteReducer";

export const TareaAgente = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(tareaAgenteReducer, initialState);
  const [actualizarTarea, setActualizarTarea] = useState(false);

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
    dispatch({ type: "INICIA_FETCH_TAREA" });
    try {
      const { data } = await api.get(`/tareas/${id}`);
      const notificacionPendiente = data.Notificacions?.find(
        (n) =>
          n.estado === "Pendiente" &&
          (n.titulo === "Cambio de plazo" || n.titulo === "Nuevas revisiones")
      );

      dispatch({
        type: "FINALIZA_FETCH_TAREA",
        tarea: data,
        botonFinalizarHabilitado: verificarFinalizar(data),
        botonComenzarHabilitado: verificarComenzar(data),
        notificacionPendiente: notificacionPendiente || false,
      });
    } catch (error) {
      dispatch({ type: "ERROR_FETCH_TAREA" });
      console.error("Error al obtener los detalles de la tarea", error);
    }
  }, [id]);

  useEffect(() => {
    fetchTareaData();
  }, [fetchTareaData, actualizarTarea]);

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
      await api.post(`/tareas/${id}/notificar`, notificacion);
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
      await api.post(`/tareas/${id}/historial`, historial);

      dispatch({ type: "EXITO_ENTREGA" });
      setActualizarTarea((prev) => !prev);
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_ENTREGA" });
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
    dispatch({ type: "INICIA_COMENZAR_TAREA" });
    if (state.tarea.estado === "Sin comenzar") {
      const estado = { estado: "Curso" };
      try {
        await api.put(`/tareas/${id}/cambiarEstado`, estado);
        const historial = {
          tipo: "Inicio",
          descripcion: "El agente comenzó la tarea",
        };
        await api.post(`/tareas/${id}/historial`, historial);

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

  const confirmarNotificacionNuevasRevisiones = async () => {
    const notificacion = state.tarea.Notificacions[0];
    const body = {
      idNotificacion: notificacion.id,
      estado: "Aceptada",
    };
    await api.put(`/tareas/${id}/confirmarNotificacion`, body);
    dispatch({ type: "CERRAR_NOTIFICACION" });
  };

  const confirmarNotificacionCambioPlazo = async () => {
    const notificacion = state.tarea.Notificacions[0];

    const body = {
      idNotificacion: notificacion.id,
      estado: "Aceptada",
    };
    try {
      await api.put(`/tareas/${id}/confirmarNotificacion`, body);
      const historial = {
        tipo: "Cambio de plazo",
        descripcion: "El agente aceptó el cambio de plazo",
      };
      await api.post(`/tareas/${id}/historial`, historial);
      setActualizarTarea((prev) => !prev);
      dispatch({ type: "EXITO_CONFIRMAR_CAMBIO_PLAZO" });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_CONFIRMAR_CAMBIO_PLAZO" });
    }
  };

  const handleCorreccionesEnviadas = () => {
    fetchTareaData();
  };

  if (state.cargando || !state.tarea || !state.tarea.estado) {
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

      <RevisionesAgente
        tareaId={id}
        revisiones={state.tarea.Revisions}
        onCorreccionesEnviadas={handleCorreccionesEnviadas}
      />

      {state.modalVisible && (
        <ModalInformativo
          modalInfo={state.modalInfo}
          onClose={() => dispatch({ type: "CERRAR_MODAL" })}
        />
      )}

      {/* Modal para "Nuevas revisiones" */}
      {state.notificacionPendiente &&
        state.notificacionPendiente.titulo === "Nuevas revisiones" && (
          <ModalNotificacion
            visible={state.notificacionPendiente}
            titulo={state.notificacionPendiente.titulo}
            descripcion="Los administradores agregaron revisiones a su tarea."
            onConfirm={confirmarNotificacionNuevasRevisiones}
            onCancel={() => dispatch({ type: "CERRAR_NOTIFICACION" })}
          />
        )}

      {/* Modal para "Cambio de plazo" */}
      {state.notificacionPendiente &&
        state.notificacionPendiente.titulo === "Cambio de plazo" && (
          <ModalNotificacion
            visible={state.notificacionPendiente}
            titulo={state.notificacionPendiente.titulo}
            descripcion={`El plazo de entrega de la tarea ha sido modificado para el día ${format(
              state.tarea.fecha_de_entrega,
              "EEEE d 'de' MMMM",
              { locale: es }
            )}`}
            onConfirm={confirmarNotificacionCambioPlazo}
            onCancel={() => dispatch({ type: "CERRAR_NOTIFICACION" })}
          />
        )}
    </div>
  );
};

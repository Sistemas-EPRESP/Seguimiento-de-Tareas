import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useReducer } from "react";
import { api } from "../../api/api";
import Loading from "../../layout/Loading";

import { format } from "date-fns";
import { es } from "date-fns/locale";

import RevisionesAgente from "../../components/RevisionesAgente";
import ModalInformativo from "../../layout/ModalInformativo";
import ModalNotificacion from "../../layout/ModalNotificacion";
import { tareaAgenteReducer, initialState } from "./tareaAgenteReducer";
import MainInfo from "./MainInfo";

export const TareaAgente = () => {
  const { id } = useParams();
  const [state, dispatch] = useReducer(tareaAgenteReducer, initialState);
  const [actualizarTarea, setActualizarTarea] = useState(false);

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
      <MainInfo
        state={state}
        dispatch={dispatch}
        setActualizarTarea={setActualizarTarea}
      />
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

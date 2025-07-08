import ModalInformativo from "../../layout/ModalInformativo";
import ModalNotificacion from "../../layout/ModalNotificacion";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import PropTypes from "prop-types";
import { api } from "../../api/api";
function Modals({ state, dispatch, setActualizarTarea }) {
  const confirmarNotificacionNuevasRevisiones = async () => {
    const notificacion = state.tarea.Notificacions[0];
    const body = {
      idNotificacion: notificacion.id,
      estado: "Aceptada",
    };
    await api.put(`/tareas/${state.tarea.id}/confirmarNotificacion`, body);
    dispatch({ type: "CERRAR_NOTIFICACION" });
  };

  const confirmarNotificacionCambioPlazo = async () => {
    const notificacion = state.tarea.Notificacions[0];

    const body = {
      idNotificacion: notificacion.id,
      estado: "Aceptada",
    };
    try {
      await api.put(`/tareas/${state.tarea.id}/confirmarNotificacion`, body);
      const historial = {
        tipo: "Cambio de plazo",
        descripcion: "El agente aceptó el cambio de plazo",
      };
      await api.post(`/tareas/${state.tarea.id}/historial`, historial);
      setActualizarTarea((prev) => !prev);
      dispatch({ type: "EXITO_CONFIRMAR_CAMBIO_PLAZO" });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_CONFIRMAR_CAMBIO_PLAZO" });
    }
  };
  return (
    <>
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
    </>
  );
}

Modals.propTypes = {
  state: PropTypes.object.required,
  dispatch: PropTypes.func.required,
  setActualizarTarea: PropTypes.func,
};
export default Modals;

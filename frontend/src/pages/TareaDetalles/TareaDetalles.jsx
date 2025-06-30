import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useContext, useReducer } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Revisiones from "./Revisiones";
import ModalInformativo from "../../layout/ModalInformativo";
import Loading from "../../layout/Loading";
import ModalNotificacion from "../../layout/ModalNotificacion";
import TareaHistorial from "./TareaHistorial";
import { api } from "../../api/api";

import { AuthContext } from "../../context/AuthContext";
import { TareaAgente } from "../TareaAgente";
import SwitchModoUsuarioBtn from "./SwitchModoUsuarioBtn";
import FormModificarTarea from "./FormModificarTarea";

import { tareaReducer, initialState } from "./tareaReducer";

export default function TareaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [state, dispatch] = useReducer(tareaReducer, initialState);

  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const { data } = await api.get(`tareas/${id}`);

        const notificacionPendiente = data.Notificacions?.find(
          (n) =>
            n.estado === "Pendiente" &&
            (n.titulo === "Finalizacion de correcciones" ||
              n.titulo === "Finalizacion de tarea")
        );
        if (notificacionPendiente) {
          dispatch({ type: "NOTIFICACION_PENDIENTE", notificacionPendiente });
        }
        dispatch({ type: "TAREA", tarea: data });
      } catch (error) {
        console.error("Error al obtener los detalles de la tarea", error);
      }
    };

    obtenerTarea();
  }, [id, state.actualizarTarea]);

  const cerrarModal = () => {
    dispatch({ type: "CERRAR_MODAL" });
    if (state.tareaEliminada) {
      navigate("/"); // Redirigir al inicio si la tarea fue eliminada
    }
  };

  const confirmarEntrega = async (e) => {
    e.preventDefault();
    const estado = { estado: "Revisión" };
    const notificacion = {
      idNotificacion: state.tarea.Notificacions[0].id,
      estado: "Aceptada",
    };
    try {
      await api.put(`tareas/${id}/cambiarEstado`, estado);

      await api.put(`tareas/${id}/confirmarNotificacion`, notificacion);
      const historial = {
        tipo: "Revisión",
        descripcion: "La tarea se encuentra en proceso de revisión",
      };
      await api.post(`tareas/${id}/historial`, historial);
      dispatch({ type: "ENTREGA_EXITOSA" });
      dispatch({ type: "ACTUALIZAR_TAREA" });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_ENTREGA" });
    }
  };

  return (
    <>
      {usuario?.rol === "Administrador" && (
        <SwitchModoUsuarioBtn
          dispatch={dispatch}
          modoACambiar={
            state.modoVista === "Administrador" ? "Agente" : "Administrador"
          }
        />
      )}

      {state.modoVista === "Administrador" ? (
        <div className="flex flex-col mt-10 gap-3 md:grid md:grid-cols-8 md:auto-rows-min md:gap-5 md:mt-0">
          {state.tarea && (
            <FormModificarTarea state={state} dispatch={dispatch} />
          )}

          <div className="col-span-3">
            {state.tarea && (
              <Revisiones
                tarea={state.tarea}
                revisiones={state.tarea.Revisions}
                onActualizar={() => dispatch({ type: "ACTUALIZAR_TAREA" })}
              />
            )}
          </div>
          <div className="col-span-8">
            {state.tarea && (
              <TareaHistorial
                historial={state.tarea.HistorialMovimientos}
                tiempos={state.tarea.TareaEstadoTiempos}
                estadoActual={state.tarea.estado}
              />
            )}
          </div>
          {state.notificacionPendiente && (
            <ModalNotificacion
              visible={state.notificacionPendiente}
              titulo={"Confirmar Entrega"}
              descripcion={"¿Deseas confirmar que la tarea fue entregada?"}
              onConfirm={(e) => confirmarEntrega(e)}
              onCancel={() =>
                dispatch({ type: "CORTAR_NOTIFICACION_PENDIENTE" })
              }
            />
          )}
          {state.modalVisible && (
            <ModalInformativo
              modalInfo={state.modalInfo}
              onClose={cerrarModal} // Pasar la función de cierre
            />
          )}
          {state.loadingOpen && <Loading />}
        </div>
      ) : (
        <TareaAgente tarea={state.tarea} />
      )}
    </>
  );
}

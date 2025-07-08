import { useParams } from "react-router-dom";
import { useEffect, useState, useCallback, useReducer } from "react";
import { api } from "../../api/api";
import Loading from "../../layout/Loading";

import Revisiones from "./Revisiones";
import { tareaAgenteReducer, initialState } from "./tareaAgenteReducer";
import MainInfo from "./MainInfo";
import Description from "./Description";
import TareaActions from "./TareaActions";
import Modals from "./Modals";

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

  const handleCorreccionesEnviadas = () => {
    fetchTareaData();
  };

  if (state.cargando || !state.tarea || !state.tarea.estado) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 ">
      <MainInfo>
        <Description state={state} />
        <TareaActions
          state={state}
          dispatch={dispatch}
          setActualizarTarea={setActualizarTarea}
        />
      </MainInfo>
      <Revisiones
        tareaId={id}
        revisiones={state.tarea.Revisions}
        onCorreccionesEnviadas={handleCorreccionesEnviadas}
      />

      <Modals
        state={state}
        dispatch={dispatch}
        setActualizarTarea={setActualizarTarea}
      />
    </div>
  );
};

export const initialState = {
  tarea: null,
  notificacionPendiente: false,
  actualizarTarea: false,
  modalInfo: {
    tipo: "",
    titulo: "",
    mensaje: "",
  },
  modalVisible: false,
  loadingOpen: false,
  tareaEliminada: false,
  cargando: false,
  confirmarEliminar: false,
  modoVista: "Administrador",
};

export function tareaReducer(state, action) {
  switch (action.type) {
    case "ACTUALIZAR_TAREA": {
      return {
        ...state,
        actualizarTarea: !state.actualizarTarea,
      };
    }
    case "NOTIFICACION_PENDIENTE": {
      return {
        ...state,
        notificacionPendiente: action.notificacionPendiente,
      };
    }
    case "TAREA": {
      return {
        ...state,
        tarea: action.tarea,
      };
    }

    case "ELIMINAR_TAREA": {
      return {
        ...state,
        loadingOpen: true,
        confirmarEliminar: false,
      };
    }
    case "ELIMINACION_EXITOSA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Exito",
          titulo: "Tarea Eliminada!",
          mensaje: "¡Tarea eliminada con éxito!",
        },
        loadingOpen: false,
        modalVisible: true,
        tareaEliminada: true,
      };
    }
    case "ERROR_ELIMINACION": {
      return {
        ...state,
        modalInfo: {
          tipo: "Error",
          titulo: "Error al eliminar",
          mensaje: "Ocurrió un error inesperado al eliminar la tarea",
        },
        loadingOpen: false,
        modalVisible: true,
      };
    }
    case "ENTREGA_EXITOSA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje: "Se confirmó la entrega de la tarea!",
        },
        notificacionPendiente: false,
        cargando: false,
        modalVisible: true,
      };
    }

    case "ERROR_ENTREGA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Error",
          titulo: "Error de servidor",
          mensaje: "No se pudo completar esta acción!",
        },
        notificacionPendiente: false,
        cargando: false,
        modalVisible: true,
      };
    }

    case "SWITCH_MODO": {
      return {
        ...state,
        modoVista:
          state.modoVista === "Administrador" ? "Agente" : "Administrador",
      };
    }

    case "ABRIR_MODAL": {
      return {
        ...state,
        modalVisible: true,
      };
    }
    case "CERRAR_MODAL": {
      return {
        ...state,
        modalVisible: false,
      };
    }

    case "CORTAR_NOTIFICACION_PENDIENTE": {
      return {
        ...state,
        notificacionPendiente: false,
      };
    }

    case "CANCELAR_ELIMINACION": {
      return {
        ...state,
        confirmarEliminar: false,
      };
    }

    default:
      throw new Error(
        "No se encontro el evento en tareaReducer: ",
        action.type
      );
  }
}

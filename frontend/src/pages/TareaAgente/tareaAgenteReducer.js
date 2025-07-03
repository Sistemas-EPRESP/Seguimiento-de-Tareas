export const initialState = {
  tarea: null,
  cargando: false,
  notificacionPendiente: false,
  botonComenzarHabilitado: false,
  botonFinalizarHabilitado: false,
  modalInfo: {
    tipo: "",
    titulo: "",
    mensaje: "",
  },
  modalVisible: false,
};

export function tareaAgenteReducer(state, action) {
  switch (action.type) {
    case "INICIA_FETCH_TAREA": {
      return {
        ...state,
        cargando: true,
      };
    }

    case "FINALIZA_FETCH_TAREA": {
      return {
        ...state,
        tarea: action.tarea,
        botonComenzarHabilitado: action.botonComenzarHabilitado,
        botonFinalizarHabilitado: action.botonFinalizarHabilitado,
        notificacionPendiente: action.notificacionPendiente,
        cargando: false,
      };
    }
    case "ERROR_FETCH_TAREA": {
      return {
        ...state,
        cargando: false,
      };
    }
    case "INICIA_ENTREGAR_TAREA": {
      return {
        ...state,
        cargando: true,
      };
    }

    case "EXITO_ENTREGA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje:
            state.tarea.estado === "Curso"
              ? "Has finalizado la tarea!"
              : "Has finalizado las correcciones!",
        },
        modalVisible: true,
      };
    }
    case "ERROR_ENTREGA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Error",
          titulo: "Operación fallida",
          mensaje: "No se pudo realizar esta acción!",
        },
        cargando: false,
        modalVisible: true,
      };
    }
    case "INICIA_COMENZAR_TAREA": {
      return {
        ...state,
        cargando: true,
      };
    }
    case "EXITO_COMENZAR_TAREA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje: "Haz comenzado la tarea!",
        },
        cargando: false,
        modalVisible: true,
      };
    }
    case "ERROR_COMENZAR_TAREA": {
      return {
        ...state,
        modalInfo: {
          tipo: "Error",
          titulo: "Operación fallida",
          mensaje: "No se pudo realizar esta acción!",
        },
        cargando: false,
      };
    }
    case "EXITO_CONFIRMAR_CAMBIO_PLAZO": {
      return {
        ...state,
        modalInfo: {
          tipo: "Exito",
          titulo: "Operación exitosa",
          mensaje: "Haz aceptado el cambio de plazo!",
        },
        notificacionPendiente: false,
        cargando: false,
        modalVisible: true,
      };
    }
    case "ERROR_CONFIRMAR_CAMBIO_PLAZO": {
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
    case "CERRAR_NOTIFICACION": {
      return {
        ...state,
        notificacionPendiente: false,
      };
    }

    case "CERRAR_MODAL": {
      return {
        ...state,
        modalVisible: false,
      };
    }
    default:
      throw new Error("No existe el evento: ", action.type);
  }
}

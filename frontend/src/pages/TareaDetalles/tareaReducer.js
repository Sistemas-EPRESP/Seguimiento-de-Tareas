export const initialState = {
  notificacionPendiente: false,
  actualizarTarea: false,
  modalInfo: {
    tipo: "",
    titulo: "",
    mensaje: "",
  },
  modalVisible: false,
  loadingOpen: false,
  tarea: null,
  tareaEliminada: false,
  cargando: false,
  confirmarEliminar: false,
  modoVista: "Administrador",
};

export default async function tareaReducer(state, action) {
  switch (action.type) {
    case "ELIMINAR_TAREA": {
      return {
        ...state,
        loadingOpen: true,
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
    case "CERRAR_MODAL": {
      return {
        ...state,
        modalVisible: false,
      };
    }
    default:
      throw new Error(
        "No se encontro el evento en tareaReducer: ",
        action.type
      );
  }
}

import { format, isEqual } from "date-fns";
import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
export default function useFormModificarTarea({
  state,
  todosAgentes,
  getValues,
  setValue,
  dispatch,
}) {
  const navigate = useNavigate();
  const handleAgregarAgente = (e) => {
    const idSeleccionado = parseInt(e.target.value);
    if (!idSeleccionado) return;

    const agente = todosAgentes.find((a) => a.id === idSeleccionado);
    if (!agente) return;

    const actuales = getValues("agentesSeleccionados");
    const yaEsta = actuales.some((a) => a.id === agente.id);

    if (yaEsta) return;

    setValue("agentesSeleccionados", [...actuales, agente]);
  };

  const handleEliminarAgente = (id) => {
    const actuales = getValues("agentesSeleccionados");
    const filtrados = actuales.filter((a) => a.id !== id);
    setValue("agentesSeleccionados", filtrados);
  };

  const submitTarea = async (values) => {
    let notificacion = {};
    let historial = {};

    const formattedData = {
      ...values,
      agentesIds: values.agentesSeleccionados.map((agente) => agente.id),
    };

    try {
      await api.put(`tareas/${state.tarea.id}`, formattedData);
      if (state.tarea.estado !== values.estado) {
        const estado = { estado: values.estado };
        historial = {
          tipo: "Cambio de estado",
          descripcion: `El estado de la tarea ha sido cambiado a ${values.estado}`,
        };
        await api.post(`tareas/${state.tarea.id}/historial`, historial);
        await api.put(`tareas/${state.tarea.id}/cambiarEstado`, estado);
      }
      dispatch({ type: "MODIFICACION_EXITOSA" });
    } catch (error) {
      dispatch({
        type: "ERROR_MODIFICACION",
        errorMessage: error.response.data.error,
      });
    }
    if (
      !isEqual(new Date(state.tarea.fecha_de_entrega), values.fecha_de_entrega)
    ) {
      notificacion = {
        titulo: "Cambio de plazo",
        mensaje: `El plazo de entrega de la tarea a sido cambiado para el día ${format(
          values.fecha_de_entrega,
          "dd/MM/yyyy"
        )}`,
      };
      await api.post(`tareas/${state.tarea.id}/notificar`, notificacion);
      historial = {
        tipo: "Cambio de plazo",
        descripcion: `El plazo de entrega de la tarea a sido cambiado para el ${format(
          values.fecha_de_entrega,
          "EEEE d 'de' MMMM",
          { locale: es }
        )}`,
      };

      await api.post(`tareas/${state.tarea.id}/historial`, historial);
    }
  };

  const finalizarTarea = async (e) => {
    e.preventDefault();
    const estado = { estado: "Finalizado" };
    try {
      await api.put(`tareas/${state.tarea.id}/cambiarEstado`, estado);
      const historial = {
        tipo: "Finalización",
        descripcion: "La tarea ha sido finalizada",
      };
      await api.post(`tareas/${state.tarea.id}/historial`, historial);
      setValue("estado", "Finalizado");
      dispatch({ type: "MODIFICACION_EXITOSA" });
    } catch (error) {
      console.error(error);
    }
  };

  const eliminarTarea = async () => {
    dispatch({ type: "ELIMINAR_TAREA" });

    try {
      await api.delete(`tareas/${state.tarea.id}`);
      dispatch({ type: "ELIMINACION_EXITOSA" });
    } catch (error) {
      console.error(error);
      dispatch({ type: "ERROR_ELIMINACION" });
    }
  };

  const cerrarModal = () => {
    dispatch({ type: "ABRIR_MODAL" });
    if (state.tareaEliminada) {
      navigate("/"); // Redirigir al inicio si la tarea fue eliminada
    }
  };

  return {
    handleEliminarAgente,
    submitTarea,
    finalizarTarea,
    eliminarTarea,
    cerrarModal,
    handleAgregarAgente,
  };
}

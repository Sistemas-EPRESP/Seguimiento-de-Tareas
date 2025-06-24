import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/api";
export default function useFormModificarTarea({
  tarea,
  todosAgentes,
  getValues,
  setValue,
  setLoadingOpen,
  setActualizarTarea,
  setModalInfo,
  setModalVisible,
  setConfirmarEliminar,
}) {
  const [tareaEliminada, setTareaEliminada] = useState(false);
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
    setLoadingOpen(true);
    let notificacion = {};
    let historial = {};
    if (tarea.fecha_de_entrega !== values.fecha_de_entrega) {
      notificacion = {
        titulo: "Cambio de plazo",
        mensaje: `El plazo de entrega de la tarea a sido cambiado para el día ${format(
          values.fecha_de_entrega,
          "dd/MM/yyyy"
        )}`,
      };
      await api.post(`tareas/${tarea.id}/notificar`, notificacion);
      historial = {
        tipo: "Cambio de plazo",
        descripcion: `El plazo de entrega de la tarea a sido cambiado para el ${format(
          values.fecha_de_entrega,
          "EEEE d 'de' MMMM",
          { locale: es }
        )}`,
      };
      await api.post(`tareas/${tarea.id}/historial`, historial);

      const formattedData = {
        ...values,
        agentesIds: values.agentesSeleccionados.map((agente) => agente.id),
      };

      try {
        await api.put(`tareas/${tarea.id}`, formattedData);
        if (tarea.estado !== values.estado) {
          const estado = { estado: values.estado };
          historial = {
            tipo: values.estado,
            descripcion: `El estado de la tarea ha sido cambiado a ${values.estado}`,
          };
          await api.post(`tareas/${tarea.id}/historial`, historial);
          await api.put(`tareas/${tarea.id}/cambiarEstado`, estado);
        }
        setActualizarTarea((prev) => !prev);
        setModalInfo({
          tipo: "Exito",
          titulo: "Tarea Actualizada!",
          mensaje: "¡Tarea actualizada con éxito!",
        });
      } catch (error) {
        setModalInfo({
          tipo: "Error",
          titulo: "Error al crear la tarea",
          mensaje:
            error.response.data.error ||
            "Ocurrió un error al crear la tarea. Intente nuevamente.",
        });
      } finally {
        setLoadingOpen(false);
        setModalVisible(true);
      }
    }
  };

  const finalizarTarea = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    const estado = { estado: "Finalizado" };
    try {
      await api.put(`tareas/${tarea.id}/cambiarEstado`, estado);
      const historial = {
        tipo: "Finalización",
        descripcion: "La tarea ha sido finalizada",
      };
      await api.post(`tareas/${tarea.id}/historial`, historial);

      setActualizarTarea((prev) => !prev);
      setModalInfo({
        tipo: "Exito",
        titulo: "Operación exitosa",
        mensaje: "La tarea ha sido finalizada",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingOpen(false);
      setModalVisible(true);
    }
  };

  const eliminarTarea = async () => {
    setConfirmarEliminar(false);
    setLoadingOpen(true);
    try {
      await api.delete(`tareas/${tarea.id}`);
      setModalInfo({
        tipo: "Exito",
        titulo: "Tarea Eliminada!",
        mensaje: "¡Tarea eliminada con éxito!",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Error al eliminar",
        mensaje: "Ocurrió un error inesperado al eliminar la tarea",
      });
    } finally {
      setLoadingOpen(false);
      setModalVisible(true);
      setTareaEliminada(true);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    if (tareaEliminada) {
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

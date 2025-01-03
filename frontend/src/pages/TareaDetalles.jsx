import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import config from "../api/config";
import { es } from "date-fns/locale";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Revisiones from "../components/Revisiones";
import AgenteSeleccionado from "../components/AgenteSeleccionado";
import ModalInformativo from "../layout/ModalInformativo";
import Loading from "../layout/Loading";
import { format } from "date-fns";
import ModalNotificacion from "../layout/ModalNotificacion";
import TareaHistorial from "../components/TareaHistorial";

export default function TareaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notificacionPendiente, setNotificacionPendiente] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [tarea, setTarea] = useState(null);
  const [tareaEliminada, setTareaEliminada] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    prioridad: "",
    estado: "",
    fecha_inicio: null,
    fecha_de_entrega: null,
    fecha_limite: null,
    fecha_vencimiento: null,
    agentesSeleccionados: [],
  });
  const [todosAgentes, setTodosAgentes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/tareas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTarea(data);
        setFormData({
          nombre: data.nombre,
          descripcion: data.descripcion,
          prioridad: data.prioridad,
          estado: data.estado,
          fecha_inicio: new Date(data.fecha_inicio),
          fecha_de_entrega: new Date(data.fecha_de_entrega),
          fecha_limite: new Date(data.fecha_limite),
          fecha_vencimiento: new Date(data.fecha_vencimiento),
          agentesSeleccionados: data.Agentes || [],
        });

        // Verificar notificaciones pendientes
        if (data.Notificacions?.some((n) => n.estado === "Pendiente")) {
          setNotificacionPendiente(true);
        }
        console.log(data);
      } catch (error) {
        console.error("Error al obtener los detalles de la tarea", error);
      }
    };
    const obtenerAgentes = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/agentes`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTodosAgentes(data);
      } catch (error) {
        console.error("Error al obtener los agentes", error);
      }
    };

    obtenerTarea();
    obtenerAgentes();
  }, [id, token]);

  const modificarTarea = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);

    const agentesIds = formData.agentesSeleccionados.map((agente) => agente.id);
    const { agentesSeleccionados, ...formDataSinExtras } = formData;

    const formattedData = {
      ...formDataSinExtras,
      fecha_inicio: formData.fecha_inicio
        ? format(formData.fecha_inicio, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      fecha_vencimiento: formData.fecha_vencimiento
        ? format(formData.fecha_vencimiento, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx", {
            locale: es,
          })
        : "",
      agentesIds,
    };

    try {
      await axios.put(`${config.apiUrl}/tareas/${id}`, formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalInfo({
        tipo: "Exito",
        titulo: "Tarea Actualizada!",
        mensaje: "¡Tarea actualizada con éxito!",
      });
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Error al actualizar",
        mensaje: "Ocurrió un error inesperado al actualizar la tarea",
      });
    } finally {
      setLoadingOpen(false);
      setModalVisible(true);
    }
  };

  const eliminarTarea = async () => {
    setLoadingOpen(true);
    try {
      await axios.delete(`${config.apiUrl}/tareas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalInfo({
        tipo: "Exito",
        titulo: "Tarea Eliminada!",
        mensaje: "¡Tarea eliminada con éxito!",
      });
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
      //navigate("/");
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const cerrarModal = () => {
    setModalVisible(false);
    if (tareaEliminada) {
      navigate("/"); // Redirigir al inicio si la tarea fue eliminada
    }
  };

  const handleDateChange = (name, date) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: date,
    }));
  };

  const handleChange = (e, name, value) => {
    if (e) {
      const { name: eventName, value: eventValue } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [eventName]: eventValue,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const agregarAgente = (e) => {
    //console.log(formData);
    const agenteId = parseInt(e.target.value);
    //console.log(todosAgentes);
    const agenteSeleccionado = todosAgentes.find(
      (agente) => agente.id === agenteId
    );

    if (
      agenteSeleccionado &&
      !formData.agentesSeleccionados.some((a) => a.id === agenteSeleccionado.id)
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        agentesSeleccionados: [
          ...prevFormData.agentesSeleccionados,
          agenteSeleccionado,
        ],
      }));
    }
  };

  const eliminarAgente = (e, id) => {
    e.preventDefault();
    setFormData((prevFormData) => ({
      ...prevFormData,
      agentesSeleccionados: prevFormData.agentesSeleccionados.filter(
        (agente) => agente.id !== id
      ),
    }));
  };

  const toggleExpandirRevision = (revisionId) => {
    setExpandidaRevision((prevId) =>
      prevId === revisionId ? null : revisionId
    );
  };

  const finalizarTarea = async (e) => {
    e.preventDefault();
    setLoadingOpen(true);
    const estado = { estado: "Finalizado" };
    try {
      const { data } = await axios.put(
        `${config.apiUrl}/tareas/${id}/cambiarEstado`,
        estado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historial = {
        tipo: "Finalización",
        descripcion: "La tarea ha sido finalizada",
      };
      const resp2 = await axios.post(
        `${config.apiUrl}/tareas/${id}/historial`,
        historial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTarea((prevTarea) => ({
        ...prevTarea,
        estado: data.tarea.estado,
      }));
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

  const confirmarEntrega = async () => {
    const estado = { estado: "Revisión" };
    const notificacion = {
      idNotificacion: tarea.Notificacions[0].id,
      estado: "Aceptada",
    };
    try {
      const { data } = await axios.put(
        `${config.apiUrl}/tareas/${id}/cambiarEstado`,
        estado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resp = await axios.put(
        `${config.apiUrl}/tareas/${id}/confirmarNotificacion`,
        notificacion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historial = {
        tipo: "Revisión",
        descripcion: "La tarea se encuentra en proceso de revisión",
      };
      const resp2 = await axios.post(
        `${config.apiUrl}/tareas/${id}/historial`,
        historial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Actualiza el estado de la tarea directamente con la respuesta
      setTarea((prevTarea) => ({
        ...prevTarea,
        ...data, // Mezcla todos los datos nuevos en el estado actual
      }));
      setModalInfo({
        tipo: "Exito",
        titulo: "Operación exitosa",
        mensaje: "Se confirmó la entrega de la tarea!",
      });
    } catch (error) {
      console.error(error);
      setModalInfo({
        tipo: "Error",
        titulo: "Error de servidor",
        mensaje: "No se pudo completar esta acción!",
      });
    } finally {
      setNotificacionPendiente(false);
      setCargando(false);
      setModalVisible(true);
    }
  };

  return (
    <div className="">
      <div className="flex gap-5">
        <div
          id="MODIFICAR TAREA"
          className="bg-gray-800 p-4 rounded-xl text-gray-100 w-[65%]"
        >
          <h1 className="text-3xl font-semibold mb-4">Modificar Tarea</h1>
          <form onSubmit={modificarTarea} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Prioridad:
              </label>
              <select
                name="prioridad"
                value={formData.prioridad}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              >
                <option value="">Seleccionar prioridad</option>
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
                <option value="Periódica">Periódica</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Inicio:
              </label>
              <DatePicker
                selected={formData.fecha_inicio}
                onChange={(date) => handleDateChange("fecha_inicio", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de inicio"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Entrega:
              </label>
              <DatePicker
                selected={formData.fecha_de_entrega}
                onChange={(date) => handleDateChange("fecha_de_entrega", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de entrega del agente"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha Limite:
              </label>
              <DatePicker
                selected={formData.fecha_limite}
                onChange={(date) => handleDateChange("fecha_limite", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de limite"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">
                Fecha de Vencimiento:
              </label>
              <DatePicker
                selected={formData.fecha_vencimiento}
                onChange={(date) => handleDateChange("fecha_vencimiento", date)}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de vencimiento"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estado:</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              >
                <option value="">Seleccionar estado</option>
                <option value="Sin comenzar">Sin comenzar</option>
                <option value="Curso">Curso</option>
                <option value="Corrección">Corrección</option>
                <option value="Bloqueado">Bloqueado</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Revisión">Revisión</option>
              </select>
            </div>
            <div className="">
              <label className="block text-sm font-medium mb-2">Agentes:</label>
              <select
                onChange={agregarAgente}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              >
                <option value="">Seleccionar agente</option>
                {todosAgentes.map((agente) => (
                  <option key={agente.id} value={agente.id}>
                    {agente.nombre} {agente.apellido}
                  </option>
                ))}
              </select>
            </div>

            <div className="">
              <label className="block text-sm font-medium mb-2">
                Descripción:
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-100 ">
                Agentes seleccionados:
              </label>
              <div
                id="Mostrar agentes"
                className=" p-2 bg-gray-700 rounded-md h-[112px] overflow-y-auto"
              >
                <div className="flex flex-wrap gap-2">
                  {formData.agentesSeleccionados.length > 0 ? (
                    formData.agentesSeleccionados.map((agente, index) => (
                      <AgenteSeleccionado
                        key={index}
                        agente={agente}
                        onRemove={(e) => eliminarAgente(e, agente.id)}
                      />
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No hay agentes seleccionados.
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              className="bg-green-500 w-full rounded-xl py-2 px-4 hover:bg-green-600"
              onClick={(e) => finalizarTarea(e)}
            >
              Finalizado
            </button>
            <div className="flex gap-4 col-start-2">
              <button
                type="submit"
                className="bg-blue-500 w-full rounded-xl py-2 px-4 hover:bg-blue-600"
              >
                Actualizar
              </button>
              <button
                className="w-full bg-red-500 text-white py-2 rounded-xl hover:bg-red-700 transition-colors"
                onClick={eliminarTarea}
                type="button"
              >
                Eliminar tarea
              </button>
            </div>
          </form>
        </div>
        {tarea && (
          <Revisiones tareaId={id} tarea={tarea} revisiones={tarea.Revisions} />
        )}
      </div>
      {tarea && (
        <TareaHistorial
          historial={tarea.HistorialMovimientos}
          tiempos={tarea.TareaEstadoTiempos}
          estadoActual={tarea.estado}
        />
      )}
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={cerrarModal} // Pasar la función de cierre
        />
      )}
      {loadingOpen && <Loading />}
      {notificacionPendiente && (
        <ModalNotificacion
          visible={notificacionPendiente}
          onConfirm={confirmarEntrega}
          onCancel={() => setNotificacionPendiente(false)}
        />
      )}
    </div>
  );
}

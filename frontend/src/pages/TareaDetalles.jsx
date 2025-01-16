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
import { useFormik } from "formik";
import * as Yup from "yup";
import ModalConfirmacion from "../layout/ModalConfirmacion";

export default function TareaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notificacionPendiente, setNotificacionPendiente] = useState(false);
  const [actualizarTarea, setActualizarTarea] = useState(false);

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
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);

  const validationSchema = Yup.object().shape({
    nombre: Yup.string().required("El nombre es obligatorio"),
    agentesSeleccionados: Yup.array().min(
      1,
      "Debe seleccionar al menos un agente"
    ),
    fecha_inicio: Yup.date().required("La fecha de inicio es obligatoria"),
    fecha_de_entrega: Yup.date()
      .required("La fecha de entrega es obligatoria")
      .min(
        Yup.ref("fecha_inicio"),
        "La fecha de entrega debe ser posterior o igual a la fecha de inicio"
      ),
    fecha_limite: Yup.date()
      .required("La fecha límite es obligatoria")
      .min(
        Yup.ref("fecha_de_entrega"),
        "La fecha límite debe ser posterior o igual a la fecha de entrega"
      ),
    fecha_vencimiento: Yup.date()
      .required("La fecha de vencimiento es obligatoria")
      .min(
        Yup.ref("fecha_limite"),
        "La fecha de vencimiento debe ser posterior o igual a la fecha límite"
      ),
    prioridad: Yup.string().required("Debe seleccionar una prioridad"),
    estado: Yup.string().required("Debe seleccionar un estado"),
  });

  const formik = useFormik({
    initialValues: {
      nombre: "",
      fecha_inicio: null,
      fecha_de_entrega: null,
      fecha_limite: null,
      fecha_vencimiento: null,
      descripcion: "",
      prioridad: "",
      estado: "",
      agentesSeleccionados: [],
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoadingOpen(true);

      const formattedData = {
        ...values,
        agentesIds: values.agentesSeleccionados.map((agente) => agente.id),
      };

      try {
        await axios.put(`${config.apiUrl}/tareas/${id}`, formattedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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
    },
  });

  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/tareas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        formik.setValues({
          nombre: data.nombre,
          fecha_inicio: new Date(data.fecha_inicio),
          fecha_de_entrega: new Date(data.fecha_de_entrega),
          fecha_limite: new Date(data.fecha_limite),
          fecha_vencimiento: new Date(data.fecha_vencimiento),
          descripcion: data.descripcion,
          prioridad: data.prioridad,
          estado: data.estado,
          agentesSeleccionados: data.Agentes || [],
        });

        // Verificar notificaciones pendientes
        if (data.Notificacions?.some((n) => n.estado === "Pendiente")) {
          setNotificacionPendiente(true);
        }

        setTarea(data);
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
  }, [id, token, actualizarTarea]);

  const eliminarTarea = async () => {
    setConfirmarEliminar(false);
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
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    if (tareaEliminada) {
      navigate("/"); // Redirigir al inicio si la tarea fue eliminada
    }
  };

  const handleAgregarAgente = (e) => {
    const agenteId = parseInt(e.target.value);
    const agenteSeleccionado = todosAgentes.find(
      (agente) => agente.id === agenteId
    );

    if (
      agenteSeleccionado &&
      !formik.values.agentesSeleccionados.some(
        (agente) => agente.id === agenteId
      )
    ) {
      formik.setFieldValue("agentesSeleccionados", [
        ...formik.values.agentesSeleccionados,
        agenteSeleccionado,
      ]);
    }
  };

  const handleEliminarAgente = (idAgente) => {
    formik.setFieldValue(
      "agentesSeleccionados",
      formik.values.agentesSeleccionados.filter(
        (agente) => agente.id !== idAgente
      )
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
      setActualizarTarea((prev) => !prev);
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
    <div className="grid grid-cols-8 auto-rows-min gap-5">
      <div
        id="MODIFICAR TAREA"
        className="bg-gray-800 p-4 rounded-xl text-gray-100 col-span-5"
      >
        <h1 className="text-3xl font-semibold mb-4">Modificar Tarea</h1>
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <p className="text-red-500 text-sm">{formik.errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Prioridad:</label>
            <select
              name="prioridad"
              value={formik.values.prioridad}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
            >
              <option value="">Seleccionar prioridad</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
              <option value="Periódica">Periódica</option>
            </select>
            {formik.touched.prioridad && formik.errors.prioridad && (
              <p className="text-red-500 text-sm">{formik.errors.prioridad}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Estado:</label>
            <select
              name="estado"
              value={formik.values.estado}
              onChange={formik.handleChange}
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
            {formik.touched.estado && formik.errors.estado && (
              <p className="text-red-500 text-sm">{formik.errors.estado}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha de Inicio:
            </label>
            <DatePicker
              selected={formik.values.fecha_inicio}
              onChange={(date) => formik.setFieldValue("fecha_inicio", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora de inicio"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              wrapperClassName="w-full"
            />
            {formik.touched.fecha_inicio && formik.errors.fecha_inicio && (
              <p className="text-red-500 text-sm">
                {formik.errors.fecha_inicio}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha de Entrega:
            </label>
            <DatePicker
              selected={formik.values.fecha_de_entrega}
              onChange={(date) =>
                formik.setFieldValue("fecha_de_entrega", date)
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora de entrega"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              wrapperClassName="w-full"
            />
            {formik.touched.fecha_de_entrega &&
              formik.errors.fecha_de_entrega && (
                <p className="text-red-500 text-sm">
                  {formik.errors.fecha_de_entrega}
                </p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha Límite:
            </label>
            <DatePicker
              selected={formik.values.fecha_limite}
              onChange={(date) => formik.setFieldValue("fecha_limite", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora límite"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              wrapperClassName="w-full"
            />
            {formik.touched.fecha_limite && formik.errors.fecha_limite && (
              <p className="text-red-500 text-sm">
                {formik.errors.fecha_limite}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Fecha de Vencimiento:
            </label>
            <DatePicker
              selected={formik.values.fecha_vencimiento}
              onChange={(date) =>
                formik.setFieldValue("fecha_vencimiento", date)
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora de vencimiento"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
              wrapperClassName="w-full"
            />
            {formik.touched.fecha_vencimiento &&
              formik.errors.fecha_vencimiento && (
                <p className="text-red-500 text-sm">
                  {formik.errors.fecha_vencimiento}
                </p>
              )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">Agentes:</label>
            <select
              onChange={handleAgregarAgente}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            >
              <option value="">Seleccionar agente</option>
              {todosAgentes.map((agente) => (
                <option key={agente.id} value={agente.id}>
                  {agente.nombre} {agente.apellido}
                </option>
              ))}
            </select>
            {formik.touched.agentesSeleccionados &&
              formik.errors.agentesSeleccionados && (
                <p className="text-red-500 text-sm">
                  {formik.errors.agentesSeleccionados}
                </p>
              )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium mb-2">
              Descripción:
            </label>
            <textarea
              name="descripcion"
              value={formik.values.descripcion}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 min-h-10 max-h-60 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-100">
              Agentes seleccionados:
            </label>
            <div
              id="Mostrar agentes"
              className="p-2 bg-gray-700 rounded-md h-[112px] overflow-y-auto"
            >
              <div className="flex flex-wrap gap-2">
                {formik.values.agentesSeleccionados.length > 0 ? (
                  formik.values.agentesSeleccionados.map((agente) => (
                    <AgenteSeleccionado
                      key={agente.id}
                      agente={agente}
                      onRemove={() => handleEliminarAgente(agente.id)}
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
            onClick={finalizarTarea}
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
              onClick={() => setConfirmarEliminar(true)}
              type="button"
            >
              Eliminar tarea
            </button>
          </div>
        </form>
      </div>
      <div className="col-span-3">
        {tarea && (
          <Revisiones tareaId={id} tarea={tarea} revisiones={tarea.Revisions} />
        )}
      </div>

      <div className="col-span-8">
        {tarea && (
          <TareaHistorial
            historial={tarea.HistorialMovimientos}
            tiempos={tarea.TareaEstadoTiempos}
            estadoActual={tarea.estado}
          />
        )}
      </div>

      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={cerrarModal} // Pasar la función de cierre
        />
      )}
      {loadingOpen && <Loading />}
      <ModalConfirmacion
        open={confirmarEliminar}
        onClose={() => setConfirmarEliminar(false)} // Cierra el modal
        onConfirm={eliminarTarea} // Llama a eliminarTarea al confirmar
        mensaje="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
      />
    </div>
  );
}

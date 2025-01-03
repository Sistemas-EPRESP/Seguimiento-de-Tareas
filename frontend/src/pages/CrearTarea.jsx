import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "../components/Select";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import config from "../api/config.js";
import CloseIcon from "@mui/icons-material/Close";
import SelectAgente from "../components/SelectAgente.jsx";
import ModalInformativo from "../layout/ModalInformativo";
import Loading from "../layout/Loading";
import AgenteSeleccionado from "../components/AgenteSeleccionado";

export default function CrearTareas() {
  const navigate = useNavigate();
  const [agentes, setAgentes] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [agentesSeleccionados, setAgentesSeleccionados] = useState([]);
  const token = localStorage.getItem("token");
  const [hayAgentes, setHayAgentes] = useState(false);

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

  useEffect(() => {
    const obtenerAgentes = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/agentes`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAgentes(data);
      } catch (error) {
        console.error("Error al obtener los agentes", error);
      }
    };
    obtenerAgentes();
  }, [token]);

  const handleAgregarAgente = (e) => {
    const agenteId = parseInt(e.target.value);
    const agenteSeleccionado = agentes.find((agente) => agente.id === agenteId);

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
        await axios.post(`${config.apiUrl}/tareas`, formattedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModalInfo({
          tipo: "Exito",
          titulo: "Tarea Creada",
          mensaje: "¡Tarea creada con éxito!",
        });
      } catch (error) {
        setModalInfo({
          tipo: "Error",
          titulo: "Error al crear la tarea",
          mensaje: "Ocurrió un error inesperado al crear la tarea.",
        });
      } finally {
        setLoadingOpen(false);
        setModalVisible(true);
      }
    },
  });
  return (
    <div className="flex justify-center items-center mt-10 px-60">
      <div className="w-3/4 bg-gray-800 text-gray-100 rounded-lg p-8 shadow-2xl">
        <h1 className="text-4xl mb-6 text-center">Crear Tarea</h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={formik.values.nombre}
              onChange={formik.handleChange}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            />
            {formik.touched.nombre && formik.errors.nombre && (
              <p className="text-red-500 text-sm">{formik.errors.nombre}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Agentes:</label>
            <select
              onChange={handleAgregarAgente}
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
            >
              <option value="">Seleccionar agente</option>
              {agentes.map((agente) => (
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
          <div>
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

          <div className="grid grid-cols-2 gap-5 ">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">
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
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
              {formik.touched.fecha_inicio && formik.errors.fecha_inicio && (
                <p className="text-red-500 text-sm">
                  {formik.errors.fecha_inicio}
                </p>
              )}
            </div>

            {/* Campo Fecha de Entrega */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">
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
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
              {formik.touched.fecha_de_entrega &&
                formik.errors.fecha_de_entrega && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.fecha_de_entrega}
                  </p>
                )}
            </div>

            {/* Campo Fecha Límite */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">
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
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
              {formik.touched.fecha_limite && formik.errors.fecha_limite && (
                <p className="text-red-500 text-sm">
                  {formik.errors.fecha_limite}
                </p>
              )}
            </div>

            {/* Campo Fecha de Vencimiento */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-100">
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
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                wrapperClassName="w-full"
              />
              {formik.touched.fecha_vencimiento &&
                formik.errors.fecha_vencimiento && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.fecha_vencimiento}
                  </p>
                )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-100">
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

          {/* Prioridad y Estado */}
          <div className="flex gap-5">
            <div className="w-1/2">
              <Select
                label="Prioridad"
                opciones={["Alta", "Media", "Baja", "Periódica"]}
                onChange={(value) => formik.setFieldValue("prioridad", value)}
                value={formik.values.prioridad}
                placeHolder="Seleccione la prioridad"
                labelClassName="block text-sm font-medium mb-1 text-gray-100"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
              {formik.touched.prioridad && formik.errors.prioridad && (
                <p className="text-red-500 text-sm">
                  {formik.errors.prioridad}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <Select
                label="Estado"
                opciones={["Sin comenzar", "Bloqueado"]}
                onChange={(value) => formik.setFieldValue("estado", value)}
                value={formik.values.estado}
                placeHolder="Seleccione un estado"
                labelClassName="block text-sm font-medium mb-1 text-gray-100"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
              {formik.touched.estado && formik.errors.estado && (
                <p className="text-red-500 text-sm">{formik.errors.estado}</p>
              )}
            </div>
          </div>

          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)}
        />
      )}
      {loadingOpen && <Loading />}
    </div>
  );
}

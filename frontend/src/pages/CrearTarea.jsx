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
        await axios.post(`${config.apiUrl}/tareas`, formattedData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setModalInfo({
          tipo: "Exito",
          titulo: "Tarea Creada",
          mensaje: "¡Tarea creada con éxito!",
        });
      } catch (error) {
        console.log(error);

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
  return (
    <div className="flex justify-center items-center mt-10 px-4 sm:px-10 md:px-20 lg:px-40 xl:px-60">
      <div className="w-full max-w-4xl bg-gray-800 text-gray-100 rounded-lg p-6 sm:p-8 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6 text-center">
          Tarea nueva
        </h1>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
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

          {/* Selección de Agentes */}
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

          {/* Lista de Agentes Seleccionados */}
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

          {/* Fechas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { label: "Fecha de Inicio", name: "fecha_inicio" },
              { label: "Fecha de Entrega", name: "fecha_de_entrega" },
              { label: "Fecha Límite", name: "fecha_limite" },
              { label: "Fecha de Vencimiento", name: "fecha_vencimiento" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium mb-1">
                  {label}:
                </label>
                <DatePicker
                  selected={formik.values[name]}
                  onChange={(date) => formik.setFieldValue(name, date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="dd/MM/yyyy HH:mm"
                  locale={es}
                  placeholderText={`Selecciona ${label.toLowerCase()}`}
                  className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
                  wrapperClassName="w-full"
                />
                {formik.touched[name] && formik.errors[name] && (
                  <p className="text-red-500 text-sm">{formik.errors[name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium mb-1">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Select
                label="Prioridad"
                opciones={["Alta", "Media", "Baja", "Periódica"]}
                onChange={(value) => formik.setFieldValue("prioridad", value)}
                value={formik.values.prioridad}
                placeHolder="Seleccione la prioridad"
                labelClassName="block text-sm font-medium mb-1"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
              {formik.touched.prioridad && formik.errors.prioridad && (
                <p className="text-red-500 text-sm">
                  {formik.errors.prioridad}
                </p>
              )}
            </div>

            <div>
              <Select
                label="Estado"
                opciones={["Sin comenzar", "Bloqueado"]}
                onChange={(value) => formik.setFieldValue("estado", value)}
                value={formik.values.estado}
                placeHolder="Seleccione un estado"
                labelClassName="block text-sm font-medium mb-1"
                selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
              />
              {formik.touched.estado && formik.errors.estado && (
                <p className="text-red-500 text-sm">{formik.errors.estado}</p>
              )}
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>

      {/* Modales */}
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

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { yupResolver } from "@hookform/resolvers/yup";
import { tareaSchema } from "./TareaSchemas";

import AgenteSeleccionado from "../../components/AgenteSeleccionado";
import ModalInformativo from "../../layout/ModalInformativo";
import ModalConfirmacion from "../../layout/ModalConfirmacion";
import Loading from "../../layout/Loading";

import config from "../../api/config";
import PropTypes from "prop-types";
import useFormModificarTarea from "./useFormModificarTarea";
export default function FormModificarTarea({ tarea }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      nombre: tarea.nombre,
      fecha_inicio: new Date(tarea.fecha_inicio),
      fecha_de_entrega: new Date(tarea.fecha_de_entrega),
      fecha_limite: new Date(tarea.fecha_limite),
      fecha_vencimiento: new Date(tarea.fecha_vencimiento),
      descripcion: tarea.descripcion,
      prioridad: tarea.prioridad,
      estado: tarea.estado,
      agentesSeleccionados: tarea.Agentes,
    },
    resolver: yupResolver(tareaSchema),
  });
  const token = localStorage.getItem("token");

  const [actualizarTarea, setActualizarTarea] = useState(false);
  const [todosAgentes, setTodosAgentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);

  const {
    handleEliminarAgente,
    submitTarea,
    finalizarTarea,
    eliminarTarea,
    cerrarModal,
    handleAgregarAgente,
  } = useFormModificarTarea({
    tarea,
    todosAgentes,
    getValues,
    setValue,
    setLoadingOpen,
    setActualizarTarea,
    setModalInfo,
    setModalVisible,
    setConfirmarEliminar,
  });

  useEffect(() => {
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
    obtenerAgentes();
  }, [tarea.id, token, actualizarTarea]);

  return (
    <div
      id="MODIFICAR TAREA"
      className="bg-gray-800 p-4 rounded-xl text-gray-100 col-span-5"
    >
      <h1 className="text-3xl font-semibold mb-4">Modificar Tarea</h1>
      <form
        onSubmit={handleSubmit((data) => submitTarea(data))}
        className="grid grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-2">Nombre:</label>
          <input
            type="text"
            {...register("nombre", { required: true })}
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
          />
          {errors.nombre?.type === "required" && (
            <p className="text-red-500 text-sm">El nombre es obligatorio</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prioridad:</label>
          <select
            {...register("prioridad", { required: true })}
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
          >
            <option value="">Seleccionar prioridad</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
            <option value="Periódica">Periódica</option>
          </select>
          {errors.prioridad?.type === "required" && (
            <p className="text-red-500 text-sm">
              Debe seleccionar una prioridad
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Estado:</label>
          <select
            {...register("estado", { required: true })}
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
          {errors.estado?.type === "required" && (
            <p className="text-red-500 text-sm">Debe seleccionar un estado</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha de Inicio:
          </label>
          <Controller
            name="fecha_inicio"
            control={control}
            rules={{ required: "Debe incluir una fecha de inicio" }}
            render={({ field }) => (
              <DatePicker
                {...field}
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de inicio"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                wrapperClassName="w-full"
              />
            )}
          />
          {errors.fecha_inicio && (
            <p className="text-red-500 text-sm">
              {errors.fecha_inicio.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha de Entrega:
          </label>
          <Controller
            control={control}
            name="fecha_de_entrega"
            rules={{ required: "Debe incluir una fecha de entrega" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de entrega"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                wrapperClassName="w-full"
              />
            )}
          />
          {errors.fecha_de_entrega && (
            <p className="text-red-500 text-sm">
              {errors.fecha_de_entrega.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha Límite:
          </label>
          <Controller
            control={control}
            name="fecha_limite"
            rules={{ required: "Debe incluir una fecha límite" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora límite"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                wrapperClassName="w-full"
              />
            )}
          />
          {errors.fecha_limite && (
            <p className="text-red-500 text-sm">
              {errors.fecha_limite.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Fecha de Vencimiento:
          </label>
          <Controller
            control={control}
            name="fecha_vencimiento"
            rules={{ required: "Debe incluir una fecha de vencimiento" }}
            render={({ field }) => (
              <DatePicker
                selected={field.value}
                onChange={field.onChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="dd/MM/yyyy HH:mm"
                locale={es}
                placeholderText="Selecciona fecha y hora de vencimiento"
                className="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg"
                wrapperClassName="w-full"
              />
            )}
          />
          {errors.fecha_vencimiento && (
            <p className="text-red-500 text-sm">
              {errors.fecha_vencimiento.message}
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
          {errors.agentesSeleccionados && (
            <p className="text-red-500 text-sm">
              {errors.agentesSeleccionados.message}
            </p>
          )}
        </div>

        <div className="col-span-1">
          <label className="block text-sm font-medium mb-2">Descripción:</label>
          <textarea
            {...register("descripcion")}
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
              {watch("agentesSeleccionados").length > 0 ? (
                watch("agentesSeleccionados").map((agente) => (
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
        <div className="flex gap-1 md:gap-4 col-start-2">
          <button
            type="submit"
            className="bg-blue-500 w-full rounded-xl py-2 px-1.5 md:px-4 hover:bg-blue-600"
          >
            Actualizar
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 px-2 md:px-0 rounded-xl hover:bg-red-700 transition-colors"
            onClick={() => setConfirmarEliminar(true)}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </form>
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

FormModificarTarea.propTypes = {
  tarea: PropTypes.object.isRequired,
};

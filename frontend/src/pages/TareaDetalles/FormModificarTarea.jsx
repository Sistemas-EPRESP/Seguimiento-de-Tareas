import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { es } from "date-fns/locale";
import { yupResolver } from "@hookform/resolvers/yup";
import { tareaSchema } from "./TareaSchemas";

import AgenteSeleccionado from "../../components/AgenteSeleccionado";
import ModalInformativo from "../../layout/ModalInformativo";
import ModalConfirmacion from "../../layout/ModalConfirmacion";
import Loading from "../../layout/Loading";

import PropTypes from "prop-types";
import useFormModificarTarea from "./useFormModificarTarea";
import { api } from "../../api/api";
export default function FormModificarTarea({ state, dispatch }) {
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
      nombre: state.tarea.nombre,
      fecha_inicio: new Date(state.tarea.fecha_inicio),
      fecha_de_entrega: new Date(state.tarea.fecha_de_entrega),
      fecha_limite: new Date(state.tarea.fecha_limite),
      fecha_vencimiento: new Date(state.tarea.fecha_vencimiento),
      descripcion: state.tarea.descripcion,
      prioridad: state.tarea.prioridad,
      estado: state.tarea.estado,
      agentesSeleccionados: state.tarea.Agentes,
    },
    resolver: yupResolver(tareaSchema),
  });

  const [todosAgentes, setTodosAgentes] = useState([]);

  const {
    handleEliminarAgente,
    submitTarea,
    finalizarTarea,
    eliminarTarea,
    cerrarModal,
    handleAgregarAgente,
  } = useFormModificarTarea({
    state,
    todosAgentes,
    getValues,
    setValue,
    dispatch,
  });

  useEffect(() => {
    const obtenerAgentes = async () => {
      try {
        const { data } = await api.get(`agentes`);
        setTodosAgentes(data);
      } catch (error) {
        console.error("Error al obtener los agentes", error);
      }
    };
    obtenerAgentes();
  }, [state.tarea.id, state.actualizarTarea]);

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
            <option value="Bloqueada">Bloqueada</option>
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
            className="p-2 rounded-md h-[112px] overflow-y-auto"
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
            onClick={() => dispatch({ type: "ELIMINAR_TAREA" })}
            type="button"
          >
            Eliminar
          </button>
        </div>
      </form>
      {state.modalVisible && (
        <ModalInformativo
          modalInfo={state.modalInfo}
          onClose={cerrarModal} // Pasar la función de cierre
        />
      )}
      {state.loadingOpen && <Loading />}
      <ModalConfirmacion
        open={state.confirmarEliminar}
        onClose={() => dispatch({ type: "CANCELAR_ELIMINACION" })} // Cierra el modal
        onConfirm={eliminarTarea} // Llama a eliminarTarea al confirmar
        mensaje="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
      />
    </div>
  );
}

FormModificarTarea.propTypes = {
  state: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

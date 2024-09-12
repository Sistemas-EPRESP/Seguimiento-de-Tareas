import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "../components/Select";
import DatePicker from "react-datepicker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

export default function CrearTareas() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    agente: "",
    fecha_inicio: null,
    fecha_vencimiento: null,
    descripcion: "",
    prioridad: "Baja",
    estado: "Sin comenzar",
  });

  const handleChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      fecha_inicio: formData.fecha_inicio
        ? format(formData.fecha_inicio, "dd/MM/yyyy HH:mm", { locale: es })
        : "",
      fecha_vencimiento: formData.fecha_vencimiento
        ? format(formData.fecha_vencimiento, "dd/MM/yyyy HH:mm", { locale: es })
        : "",
    };
    console.log("Tarea creada:", formattedData);
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-700 text-gray-100">
      <h1 className="text-3xl mb-6">Crear Tarea</h1>
      <form onSubmit={handleSubmit} className="grid w-3/5 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => handleChange("nombre", e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
        </div>

        <div>
          <Select
            label="Agente"
            opciones={["Galiano Carlos", "Bartolotta Cecilia", "Montes Adriel"]}
            onChange={(value) => handleChange("agente", value)}
            value={formData.agente}
            labelClassName="block text-sm font-medium mb-1 text-gray-100"
            selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
          />
        </div>
        <div className="flex gap-10">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium mb-1">
              Fecha de Inicio:
            </label>
            <DatePicker
              selected={formData.fecha_inicio}
              onChange={(date) => handleChange("fecha_inicio", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora de inicio"
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium mb-1">
              Fecha de Vencimiento:
            </label>
            <DatePicker
              selected={formData.fecha_vencimiento}
              onChange={(date) => handleChange("fecha_vencimiento", date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              dateFormat="dd/MM/yyyy HH:mm"
              locale={es}
              placeholderText="Selecciona fecha y hora de vencimiento"
              className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descripción:</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={(e) => handleChange("descripcion", e.target.value)}
            className="w-full px-3 py-2 min-h-10 max-h-80 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            rows="4"
          />
        </div>

        <div className="flex justify-between gap-5">
          <div className="w-1/2">
            <Select
              label="Prioridad"
              opciones={["Alta", "Media", "Baja", "Periódica"]}
              onChange={(value) => handleChange("prioridad", value)}
              value={formData.prioridad}
              labelClassName="block text-sm font-medium mb-1 text-gray-100"
              selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>

          <div className="w-1/2">
            <Select
              label="Estado"
              opciones={[
                "Sin comenzar",
                "En curso",
                "Bloqueado",
                "Completado",
                "En revisión",
              ]}
              onChange={(value) => handleChange("estado", value)}
              value={formData.estado}
              labelClassName="block text-sm font-medium mb-1 text-gray-100"
              selectClassName="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="w-full flex justify-end">
          <button
            type="submit"
            className="w-1/6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
}

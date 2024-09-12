import { format, parse } from "date-fns";
import { es } from "date-fns/locale";

export default function TareaCard({ tarea }) {
  const priorityColor = {
    Alta: "bg-red-500 text-red-900", // Color más intenso
    Media: "bg-yellow-500 text-yellow-900", // Color más intenso
    Baja: "bg-green-500 text-green-900", // Color más intenso
    Periódica: "bg-blue-500 text-blue-900", // Color más intenso
  };

  const statusColor = {
    "Sin comenzar": "bg-gray-100 text-gray-800",
    "En curso": "bg-blue-100 text-blue-800",
    Bloqueado: "bg-red-100 text-red-800",
    Completado: "bg-green-100 text-green-800",
    "En revisión": "bg-purple-100 text-purple-800",
  };

  // Función para parsear la fecha en formato "dd-MM-yy"
  const parseDate = (dateString) => {
    return parse(dateString, "dd-MM-yy", new Date());
  };

  return (
    <div className="mb-4 bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 hover:cursor-pointer">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold">{tarea.nombre}</h2>
        <div className="flex space-x-2">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              priorityColor[tarea.prioridad]
            }`}
          >
            {tarea.prioridad}
          </span>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              statusColor[tarea.estado]
            }`}
          >
            {tarea.estado}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-300 mt-2 mb-2">{tarea.descripcion}</p>
      <div className="text-sm text-gray-300 mb-2">Agente: {tarea.agente}</div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>
          Inicio:{" "}
          {format(parseDate(tarea.fecha_inicio), "dd MMM yyyy", { locale: es })}
        </span>
        <span>
          Vencimiento:{" "}
          {format(parseDate(tarea.fecha_vencimiento), "dd MMM yyyy", {
            locale: es,
          })}
        </span>
      </div>
    </div>
  );
}

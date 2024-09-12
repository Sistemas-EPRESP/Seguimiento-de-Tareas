export default function Component({ task }) {
  const priorityColors = {
    Alta: "bg-red-200 text-red-800",
    Media: "bg-yellow-200 text-yellow-800",
    Baja: "bg-green-200 text-green-800",
    Periódica: "bg-blue-200 text-blue-800",
  };

  const statusColors = {
    "Sin comenzar": "bg-gray-200 text-gray-800",
    "En curso": "bg-blue-200 text-blue-800",
    Bloqueado: "bg-red-200 text-red-800",
    Completado: "bg-green-200 text-green-800",
    "En revisión": "bg-yellow-200 text-yellow-800",
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">{task.nombre}</h3>
      <p className="text-gray-600 mb-4">{task.descripcion}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500">Agente: {task.agente}</span>
        <span className="text-sm text-gray-500">
          Vencimiento: {new Date(task.fecha_vencimiento).toLocaleDateString()}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            priorityColors[task.prioridad]
          }`}
        >
          {task.prioridad}
        </span>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            statusColors[task.estado]
          }`}
        >
          {task.estado}
        </span>
      </div>
    </div>
  );
}

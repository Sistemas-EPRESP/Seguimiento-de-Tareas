import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import { useNavigate } from "react-router-dom";
import Timeline from "./Timeline";

export default function TareaCard({ tarea }) {
  const navigate = useNavigate();

  const priorityColor = {
    Alta: "bg-[#EF4444] text-white",
    Media: "bg-[#F59E0B] text-black",
    Baja: "bg-[#10B981] text-white",
    Periódica: "bg-[#3B82F6] text-white",
  };

  const statusColor = {
    "Sin comenzar": "bg-[#64748B] text-white",
    Curso: "bg-green-500 text-white",
    Corrección: "bg-blue-500 text-white",
    Revisión: "bg-[#F59E0B] text-black",
    Bloqueado: "bg-red-100 text-red-800",
    Finalizado: "bg-[#10B981] text-white",
  };

  const hayNotificacionesPendientes = tarea?.Notificacions?.some(
    (notificacion) => notificacion.estado === "Pendiente"
  );

  return (
    <div
      className="mb-4 bg-gray-800 text-gray-100 rounded-lg shadow-lg p-4 hover:cursor-pointer"
      onClick={() => navigate(`/tarea/${tarea.id}`)}
    >
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-semibold flex items-center">
          {tarea.nombre}
          {hayNotificacionesPendientes && (
            <NotificationsActiveIcon
              className="ml-2 text-yellow-500"
              style={{ fontSize: "20px" }}
            />
          )}
        </h2>
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
      <p className="text-sm text-gray-300 mt-2 mb-4">{tarea.descripcion}</p>
      <div className="flex text-sm items-center text-gray-300 mb-2 gap-3">
        <PersonOutlineIcon className="text-[#94A3B8]" />
        {tarea.Agentes && tarea.Agentes.length > 0
          ? tarea.Agentes.map((agente, index) => (
              <span
                className="rounded-full border-[0.5px] text-[#E2E8F0] border-[#64748B] px-3 py-1 bg-[#334155]"
                key={index}
              >
                {agente.nombre} {agente.apellido}
              </span>
            ))
          : ""}
      </div>
      <Timeline tarea={tarea} />
    </div>
  );
}

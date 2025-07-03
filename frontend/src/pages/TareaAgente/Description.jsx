import { priorityColor, statusColor } from "./colors";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PropTypes from "prop-types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
function Description({ state }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-2xl mb-2 md:mb-0 sm:text-3xl font-semibold">
          {state.tarea.nombre}
        </h1>
        <div className="flex items-start gap-2">
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              priorityColor[state.tarea.prioridad]
            }`}
          >
            {state.tarea.prioridad}
          </span>
          <span
            className={`px-2 py-1 rounded-lg text-xs font-semibold ${
              statusColor[state.tarea.estado]
            }`}
          >
            {state.tarea.estado}
          </span>
        </div>
      </div>
      <div className="text-gray-300 max-h-24 overflow-y-auto">
        {state.tarea.descripcion ? (
          <p>{state.tarea.descripcion}</p>
        ) : (
          <p className="text-gray-400 italic">No hay descripción.</p>
        )}
      </div>
      <span className="flex items-center gap-2">
        <CalendarTodayIcon style={{ width: "20px" }} />
        <label>Asignada:</label>
        <span>
          {state.tarea.fecha_inicio
            ? format(
                new Date(state.tarea.fecha_inicio),
                "EEEE, d 'de' MMMM 'de' yyyy",
                {
                  locale: es,
                }
              )
            : "Fecha no disponible"}
        </span>
      </span>
      <span className="flex items-center gap-2">
        <CalendarTodayIcon style={{ width: "20px" }} />
        <label>Fecha de entrega:</label>
        <span>
          {state.tarea.fecha_de_entrega
            ? format(
                new Date(state.tarea.fecha_de_entrega),
                "EEEE, d 'de' MMMM 'de' yyyy",
                {
                  locale: es,
                }
              )
            : "Fecha no disponible"}
        </span>
      </span>
    </div>
  );
}

Description.propTypes = {
  state: PropTypes.object.required,
  dispatch: PropTypes.func.required,
  setActualizarTarea: PropTypes.func,
};
export default Description;

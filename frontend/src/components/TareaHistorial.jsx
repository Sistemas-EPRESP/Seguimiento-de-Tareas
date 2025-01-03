import { useEffect, useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { History, Clock } from "lucide-react";

export default function TareaHistorial({ historial, tiempos, estadoActual }) {
  const [tiempoEstadoActual, setTiempoEstadoActual] = useState(0);

  useEffect(() => {
    const estadoActualTiempo = tiempos.find(
      (estado) => estado.estado === estadoActual
    );
    if (estadoActualTiempo) {
      const { tiempo_acumulado, ultima_entrada } = estadoActualTiempo;
      const ultimaEntradaDate = new Date(ultima_entrada);
      const ahora = new Date();
      const diferenciaMs = ahora - ultimaEntradaDate;
      const diferenciaSegundos = Math.floor(diferenciaMs / 1000);
      const nuevoTiempoTotal = tiempo_acumulado + diferenciaSegundos;
      setTiempoEstadoActual(nuevoTiempoTotal);
    }
  }, [tiempos, estadoActual]);

  // Función para formatear el tiempo acumulado (de segundos a horas:minutos)
  const formatTiempo = (segundos) => {
    const dias = Math.floor(segundos / 86400);
    const horas = Math.floor((segundos % 86400) / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);

    let resultado = [];
    if (dias > 0) resultado.push(`${dias} día${dias !== 1 ? "s" : ""}`);
    if (horas > 0) resultado.push(`${horas} hora${horas !== 1 ? "s" : ""}`);
    if (minutos > 0)
      resultado.push(`${minutos} minuto${minutos !== 1 ? "s" : ""}`);

    return resultado.join(", ") || "0 minutos";
  };

  // Función para formatear la fecha
  const formatFecha = (fecha) => {
    return format(new Date(fecha), "dd/MM/yyyy HH:mm", { locale: es });
  };

  return (
    <div className="flex gap-6 mt-6">
      {/* Historial de movimientos */}
      <div className="w-[65%] bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <History className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-100">
            Historial de movimientos
          </h2>
        </div>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {historial.map((movimiento) => (
            <div
              key={movimiento.id}
              className="flex items-start gap-4 text-gray-300"
            >
              <div className="min-w-[140px] text-sm">
                {formatFecha(movimiento.fecha)}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-100">
                  {movimiento.tipo}
                </span>
                <span className="text-sm">{movimiento.descripcion}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tiempos por estado */}
      <div className="w-1/3 bg-gray-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-100">
            Tiempo por estado
          </h2>
        </div>
        <div className="space-y-4">
          {tiempos.map((tiempo) => (
            <div
              key={tiempo.id}
              className="flex flex-col gap-1 p-3 rounded-lg bg-gray-700/50"
            >
              <span className="text-sm font-medium text-gray-100">
                {tiempo.estado}
              </span>
              <span className="text-lg font-semibold text-gray-100">
                {tiempo.estado === estadoActual
                  ? formatTiempo(tiempoEstadoActual)
                  : formatTiempo(tiempo.tiempo_acumulado)}
              </span>
              {tiempo.ultima_entrada && (
                <span className="text-xs text-gray-400">
                  Última actualización: {formatFecha(tiempo.ultima_entrada)}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

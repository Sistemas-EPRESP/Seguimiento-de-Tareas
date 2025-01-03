import {
  format,
  differenceInCalendarDays,
  startOfDay,
  isSameDay,
} from "date-fns";

export default function Timeline({ tarea }) {
  // Normalizar las fechas al inicio del día
  const inicio = startOfDay(new Date(tarea.fecha_inicio));
  const entrega = startOfDay(new Date(tarea.fecha_de_entrega));
  const limite = startOfDay(new Date(tarea.fecha_limite));
  const vencimiento = startOfDay(new Date(tarea.fecha_vencimiento));
  const today = startOfDay(new Date());

  // Función para calcular el progreso dentro de un rango específico
  const calculateProgress = (start, end) => {
    if (today < start) return 0;
    if (today > end) return 100;

    const totalDays = differenceInCalendarDays(end, start);
    const daysPassed = differenceInCalendarDays(today, start);
    return Math.min(Math.max((daysPassed / totalDays) * 100, 0), 100);
  };

  // Calcular el progreso para cada segmento
  const segments = [
    {
      start: inicio,
      end: entrega,
      color: "bg-blue-700",
      progress: calculateProgress(inicio, entrega),
    },
    {
      start: entrega,
      end: limite,
      color: "bg-[#F59E0B]",
      progress: calculateProgress(entrega, limite),
    },
    {
      start: limite,
      end: vencimiento,
      color: "bg-red-700",
      progress: calculateProgress(limite, vencimiento),
    },
  ];

  // Calcular el ancho de cada segmento en porcentaje
  const totalDays = differenceInCalendarDays(vencimiento, inicio);
  const getSegmentWidth = (start, end) => {
    return (differenceInCalendarDays(end, start) / totalDays) * 100;
  };

  // Función para determinar si una fecha debe mostrarse en la fila superior
  const shouldOffsetDate = (currentDate, index, dates) => {
    return dates.some(
      (item, i) => i < index && isSameDay(item.date, currentDate)
    );
  };

  const dates = [
    { date: inicio, label: "Inicio" },
    { date: entrega, label: "Entrega" },
    { date: limite, label: "Límite" },
    { date: vencimiento, label: "Vencimiento" },
  ];

  return (
    <div className="mt-8 relative pb-16">
      {/* Barra de progreso con segmentos */}
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden flex">
        {segments.map((segment, index) => {
          const width = getSegmentWidth(segment.start, segment.end);
          const segmentProgress = (segment.progress * width) / 100;

          return (
            <div
              key={index}
              className="h-full relative"
              style={{ width: `${width}%` }}
            >
              <div
                className={`h-full ${segment.color}`}
                style={{ width: `${segment.progress}%` }}
              />
            </div>
          );
        })}
      </div>

      {/* Contenedor para puntos y etiquetas */}
      <div className="absolute w-full" style={{ top: "calc(0.5rem - 6px)" }}>
        {dates.map((item, index, array) => {
          // Calcular la posición horizontal
          const position =
            index === 0
              ? 0
              : index === array.length - 1
              ? 100
              : getSegmentWidth(inicio, item.date);

          // Ajustar el transform para el primer y último elemento
          const translateX =
            index === 0 ? "0%" : index === array.length - 1 ? "-100%" : "-50%";

          // Determinar si esta fecha debe mostrarse en la fila superior
          const isOffset = shouldOffsetDate(item.date, index, dates);

          return (
            <div
              key={index}
              className="absolute inline-flex flex-col items-center transition-all"
              style={{
                left: `${position}%`,
                transform: `translateX(${translateX})`,
                marginTop: isOffset ? "2rem" : "0",
              }}
            >
              <div className={`relative ${isOffset ? "-mt-3" : ""}`}>
                <div
                  className={`w-3 h-3 rounded-full border-2 border-gray-800 ${
                    today >= item.date ? "bg-blue-500" : "bg-gray-500"
                  }`}
                />
                {isOffset && (
                  <div className="absolute h-3 w-px bg-gray-500 -top-3 left-1/2 -translate-x-1/2" />
                )}
              </div>
              <div className="mt-2 flex flex-col items-center">
                <span className="text-xs font-medium text-gray-200">
                  {item.label}
                </span>
                <span className="text-xs text-gray-400 mt-1">
                  {format(item.date, "dd/MM/yyyy")}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

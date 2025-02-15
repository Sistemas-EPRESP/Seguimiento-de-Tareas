const Tarea = require("../models/Tarea");
const TareaView = require("../views/tareaView");
const ReporteView = require("../views/reporteView");

exports.getReportes = async (req, res) => {
  try {
    const { agente, periodo } = req.query;
    const { inicio, fin } = obtenerFechasPeriodo(periodo);
    const tareas = await TareaView.getReporteAgente(agente, inicio, fin);

    const reportesTotal = ReporteView.generarReporte(tareas);

    return res.status(200).json(reportesTotal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

exports.getReportesVencimientos = async (req, res) => {
  try {
    const { agente, periodo } = req.query;
    const { inicio, fin } = obtenerFechasPeriodo(periodo);
    const tareas = await TareaView.getReporteAgente(agente, inicio, fin);
    const reportesTotal = ReporteView.clasificarTareas(tareas);
    return res.status(200).json(reportesTotal);
  } catch (error) {
    res.status(500).json({ error: "Error al generar el reporte" });
  }
};

const obtenerFechasPeriodo = (periodo) => {
  const now = new Date();
  let inicio, fin;

  switch (periodo) {
    case "semanal":
      // Obtener el primer día de la semana (lunes)
      inicio = new Date(now);
      inicio.setDate(inicio.getDate() - inicio.getDay() - 6);

      // Obtener el último día de la semana (viernes)
      fin = new Date(inicio);
      fin.setDate(fin.getDate() + 4);

      break;
    case "mensual":
      // Obtener el primer día del mes
      inicio = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      // Obtener el último día del mes pasado
      fin = new Date(now.getFullYear(), now.getMonth(), 0);
      break;
    case "anual":
      // Obtener el primer día del año
      inicio = new Date(now.getFullYear() - 1, 0, 1);
      // Obtener el último día del año pasado
      fin = new Date(now.getFullYear() - 1, 11, 31);
      break;
    default:
      throw new Error("Periodo no válido");
  }

  // Ajustar las horas para que inicio sea a las 00:00:00 y fin a las 23:59:59
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
};

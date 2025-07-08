const TareaView = require("../views/tareaView");
const Tarea = require("../models/Tarea");
const { Op } = require("sequelize");
const Agente = require("../models/Agente");
const HistorialMovimiento = require("../models/HistorialMovimiento");
const TareaEstadoTiempo = require("../models/TareaEstadoTiempo");
const moment = require("moment");
const { toDate, getTimezoneOffset } = require("date-fns-tz");
const { format, parseISO } = require("date-fns");

// Obtener todas las tareas con agentes asociados
exports.getAllTareas = async (req, res) => {
  try {
    const tareas = await TareaView.getAllTareasConAgentes();
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una tarea por ID con agentes asociados
exports.getTareaById = async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await TareaView.getTareaCompletaPorId(id);
    if (tarea) {
      res.status(200).json(tarea);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener tareas por rango de fechas

exports.getTareasByDateRange = async (req, res) => {
  const { fechaFin } = req.query;

  // Establecer la fecha actual (hoy)
  const fechaInicio = new Date();
  fechaInicio.setHours(0, 0, 0, 0); // Asegurar que comience a las 00:00:00

  // Parsear la fecha final y asegurar que termine a las 23:59:59
  const fechaFinDate = new Date(fechaFin);
  fechaFinDate.setHours(23, 59, 59, 999); // Asegurar que termine a las 23:59:59

  if (!fechaFin) {
    return res
      .status(400)
      .json({ error: "Se requiere una fecha de vencimiento." });
  }

  try {
    // Realizar la consulta de tareas
    const tareas = await TareaView.getTareasPorRangoDeFechas(
      fechaInicio,
      fechaFinDate
    );
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva tarea con agentes asociados
exports.createTarea = async (req, res) => {
  const { ...tareaData } = req.body;
  const agentesIds = req.body.agentesIds;

  try {
    const nuevaTarea = await TareaView.createTareaConAgentes(
      tareaData,
      agentesIds
    );

    await crearTiempoEstado(nuevaTarea.id, nuevaTarea.estado);
    await registrarMovimiento(
      nuevaTarea.id,
      "Crear tarea",
      `Tarea creada con estado inicial Sin Comenzar`
    );
    res.status(201).json({ id: nuevaTarea.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una tarea
exports.updateTarea = async (req, res) => {
  const { id } = req.params;

  const { agentesIds, ...tareaData } = req.body;
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    let tareaActualizada;
    if (agentesIds && agentesIds.length > 0) {
      tareaActualizada = TareaView.updateTarea(tarea, tareaData, agentesIds);
    } else {
      throw new Error("Error con los agentes");
    }
    tareaActualizada = await TareaView.getAgentesPorTarea(id);
    res.json(tareaActualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una tarea
exports.deleteTarea = async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    await tarea.destroy();
    res.json({ message: "Tarea eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener solo agentes de una tarea
exports.getTareaAgentes = async (req, res) => {
  const { id } = req.params;
  try {
    const agentes = await TareaView.getAgentesPorTarea(id);
    if (agentes) {
      res.status(200).json(agentes);
    } else {
      res.status(404).json({ error: "Agentes no encontrados" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener solo revisiones de una tarea
exports.getTareaRevisiones = async (req, res) => {
  const { id } = req.params;
  try {
    const revisiones = await TareaView.getRevisionesPorTarea(id);
    if (revisiones) {
      res.status(200).json(revisiones);
    } else {
      res.status(404).json({ error: "Revisiones no encontradas" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarTareas = async (req, res) => {
  const query = req.query.q?.trim(); // Asegurar que el parámetro sea una cadena limpia
  const isDate = query && moment(query, "YYYY-MM-DD", true).isValid(); // Validar si es una fecha

  try {
    // Si no se envía ningún parámetro o está vacío, devolver todas las tareas
    const tareas = query
      ? await TareaView.buscarTareas(query, isDate)
      : await TareaView.getAllTareasConAgentes();

    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTareasIncompletas = async (req, res) => {
  try {
    const agenteId = req.query.idAgente; // Obtiene el ID del agente logueado desde req.params

    const tareasIncompletas = await TareaView.getTareasIncompletasPorAgente(
      agenteId
    );

    res.status(200).json(tareasIncompletas);
  } catch (error) {
    console.error("Error al obtener tareas incompletas:", error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al obtener las tareas incompletas" });
  }
};

exports.cambiarEstados = async (req, res) => {
  try {
    const nuevoEstado = req.body.estado;
    const { id } = req.params;

    const estadosValidos = [
      "Sin comenzar",
      "Curso",
      "Revisión",
      "Confirmación de revisión",
      "Corrección",
      "Bloqueada",
      "Finalizado",
    ];

    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    if (nuevoEstado !== "Finalizado") {
      const estadoAnterior = tarea.estado;
      let ultimaFechaEstado = null;

      ultimaFechaEstado = await obtenerUltimaFechaEstado(id, estadoAnterior);

      await actualizarTiempoEstado(id, estadoAnterior, ultimaFechaEstado);

      // Registrar nueva entrada en el nuevo estado
      const nuevoRegistro = await TareaEstadoTiempo.findOne({
        where: { tareaId: id, estado: nuevoEstado },
      });

      if (nuevoRegistro) {
        // Actualizamos la última entrada
        nuevoRegistro.ultima_entrada = new Date();
        await nuevoRegistro.save();
      } else {
        // Creamos un registro nuevo
        await TareaEstadoTiempo.create({
          tareaId: id,
          estado: nuevoEstado,
          ultima_entrada: new Date(),
        });
      }
    } else {
      tarea.fecha_finalizado = new Date();
    }
    // Cambiar estado en la tarea
    tarea.estado = nuevoEstado;
    await tarea.save();
    res.status(200).json(tarea);
  } catch (error) {
    console.error("Error al cambiar de estado:", error);
    return res
      .status(500)
      .json({ error: "Error al cambiar el estado de la tarea" });
  }
};

exports.crearHistorial = async (req, res) => {
  const { id } = req.params;

  const { tipo, descripcion } = req.body;

  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }
    await registrarMovimiento(id, tipo, descripcion);
    res.status(201).json({ message: "Historial creado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTareasDelAgente = async (req, res) => {
  const { idAgente } = req.query;

  try {
    if (!idAgente) {
      return res.status(400).json({ error: "Se requiere el ID del agente" });
    }
    const agente = await Agente.findByPk(idAgente);
    if (!agente) {
      return res.status(404).json({ error: "Agente no encontrado" });
    }
    const tareas = await TareaView.getTareasPorAgente(idAgente);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerUltimaFechaEstado = async (tareaId, estado) => {
  const registro = await TareaEstadoTiempo.findOne({
    where: { tareaId, estado },
  });

  if (!registro || !registro.ultima_entrada) return null;

  // Convertir la fecha a la zona horaria de Argentina
  const fechaArgentina = restarTresHoras(registro.ultima_entrada);

  const fechaUTC = new Date(fechaArgentina);
  return fechaUTC;
};

const restarTresHoras = (fechaISO) => {
  const fecha = new Date(fechaISO);
  fecha.setHours(fecha.getHours() - 3);
  return fecha.toISOString();
};

const actualizarTiempoEstado = async (tareaId, estado, ultimaFechaEstado) => {
  if (!ultimaFechaEstado) return;

  const ahora = new Date();
  const offsetArgentina = getTimezoneOffset(
    "America/Argentina/Buenos_Aires",
    ahora
  );
  const ahoraArgentina = new Date(ahora.getTime() + offsetArgentina);

  const tiempoTranscurrido = Math.floor(
    (ahoraArgentina.getTime() - ultimaFechaEstado.getTime()) / 1000
  ); // Segundos

  const registro = await TareaEstadoTiempo.findOne({
    where: { tareaId, estado },
  });

  if (registro) {
    registro.tiempo_acumulado += tiempoTranscurrido;
    registro.ultima_entrada = null;
    await registro.save();
  }
};

/**
 * Registrar un movimiento en el historial de una tarea.
 * @param {number} tareaId - ID de la tarea.
 * @param {string} tipo - Tipo de movimiento (e.g., 'Creación', 'Cambio de estado', 'Corrección', 'Actualización').
 * @param {string} descripcion - Descripción detallada del movimiento.
 */
const registrarMovimiento = async (tareaId, tipo, descripcion) => {
  try {
    await HistorialMovimiento.create({
      tareaId,
      tipo,
      descripcion,
      fecha: new Date(),
    });
  } catch (error) {
    console.error("Error al registrar movimiento:", error);
    return { message: "Error al registrar un movimiento" };
  }
};

const crearTiempoEstado = async (idTarea, estado) => {
  await TareaEstadoTiempo.create({
    tareaId: idTarea,
    estado: estado,
    ultima_entrada: new Date(), // Fecha/hora actual como la entrada inicial
    tiempo_acumulado: 0, // Tiempo acumulado inicial
  });
};

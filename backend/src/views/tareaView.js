const Tarea = require("../models/Tarea");
const Agente = require("../models/Agente");
const Revision = require("../models/Revision");
const Correccion = require("../models/Correccion");
const Notificacion = require("../models/Notificacion");
const TareaAgente = require("../models/TareaAgente");
const TareaEstadoTiempo = require("../models/TareaEstadoTiempo");
const HistorialMovimiento = require("../models/HistorialMovimiento");
const { Op, Sequelize } = require("sequelize");
const sequelize = require("../config/database");
const { get } = require("../routes/reportesRoutes");
const revisionView = require("./revisionView");
const agenteView = require("./agenteView");
const notificacionView = require("./notificacionView");

// Obtener todas las tareas con agentes asociados
exports.getAllTareasConAgentes = async (tareas) => {
  if (tareas) {
    // Si se proporcionan tareas, devolver los agentes de cada tarea
    const tareasConAgentes = await Promise.all(
      tareas.map(async (tarea) => {
        const tareaConAgentes = await Tarea.findByPk(tarea.id, {
          include: [
            {
              model: Agente,
              through: { attributes: [] },
              attributes: ["nombre", "apellido"],
            },
          ],
        });
        return tareaConAgentes;
      })
    );
    return tareasConAgentes;
  } else {
    // Si tareas es null, devolver todas las tareas con sus agentes
    return await Tarea.findAll({
      include: [
        {
          model: Agente,
          through: { attributes: [] },
          attributes: ["nombre", "apellido"],
        },
      ],
    });
  }
};

// Crear una tarea con agentes asociados
exports.createTareaConAgentes = async (tareaData, agentesIds) => {
  let agentes = [];

  if (agentesIds && agentesIds.length > 0) {
    agentes = await agenteView.getAllAgentesById(agentesIds);
  }

  // Crear la nueva tarea
  const nuevaTarea = await Tarea.create(tareaData);
  await nuevaTarea.addAgentes(agentes);

  return nuevaTarea;
};

exports.updateTarea = async (tarea, tareaData, agentesIds) => {
  try {
    const agentes = await agenteView.getAllAgentesById(agentesIds);
    if (agentes) {
      await tarea.update(tareaData);
      await tarea.setAgentes(agentes);
    } else {
      throw new Error("Error al actualizar la tarea");
    }
    return tarea;
  } catch (error) {
    throw error;
  }
};

// Obtener una tarea por ID con agentes asociados
exports.getAgentesPorTarea = async (id) => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ["nombre", "apellido"],
      },
    ],
  });
};

// Obtener una tarea con detalles completos: agentes y revisiones
exports.getRevisionesPorTarea = async (id) => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Revision,
        include: [
          {
            model: Correccion,
            through: { attributes: [] },
          },
        ],
      },
    ],
  });
};

exports.getTareasPorRangoDeFechas = async (fechaInicio, fechaFin) => {
  return await Tarea.findAll({
    where: {
      fecha_vencimiento: {
        [Op.gte]: fechaInicio, // Fecha de vencimiento mayor o igual a la fecha de inicio
        [Op.lte]: fechaFin, // Fecha de vencimiento menor o igual a la fecha de fin
      },
      estado: {
        [Op.ne]: "Finalizado", // Excluye las tareas con estado "finalizado"
      },
    },
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ["nombre", "apellido"],
      },
      {
        model: Notificacion,
        attributes: ["id", "titulo", "estado"],
      },
    ],
  });
};

exports.getTareaCompletaPorId = async (id) => {
  try {
    // Guardar el resultado de la consulta en una variable
    const tareaCompleta = await Tarea.findByPk(id, {
      include: [
        {
          model: Agente,
          through: { attributes: [] }, // Solo es necesario para la relación muchos a muchos
          attributes: ["id", "nombre", "apellido"],
        },
        {
          model: Revision,
          include: [
            {
              model: Correccion,
            },
          ],
        },
        {
          model: Notificacion,
          attributes: ["id", "titulo", "estado"],
          where: { estado: "Pendiente" },
          required: false, // Esto permite que la tarea se devuelva aunque no haya notificaciones pendientes
        },
        {
          model: HistorialMovimiento,
          attributes: ["id", "tipo", "descripcion", "fecha"],
          required: false,
        },
        {
          model: TareaEstadoTiempo,
          attributes: ["id", "estado", "tiempo_acumulado", "ultima_entrada"],
          required: false,
        },
      ],
    });
    // Devolver la tarea completa
    return tareaCompleta;
  } catch (error) {
    console.error("Error al obtener la tarea completa:", error);
    throw error; // Re-lanza el error para ser manejado en el controlador
  }
};

exports.buscarTareas = async (busqueda) => {
  try {
    const tareas = await Tarea.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${busqueda}%` } },
          { descripcion: { [Op.iLike]: `%${busqueda}%` } },
          Sequelize.where(
            Sequelize.fn(
              "TO_CHAR",
              Sequelize.col("fecha_inicio"),
              "YYYY-MM-DD"
            ),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          Sequelize.where(
            Sequelize.fn(
              "TO_CHAR",
              Sequelize.col("fecha_vencimiento"),
              "YYYY-MM-DD"
            ),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          Sequelize.where(
            Sequelize.fn(
              "TO_CHAR",
              Sequelize.col("fecha_finalizado"),
              "YYYY-MM-DD"
            ),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          { "$Agentes.nombre$": { [Op.iLike]: `%${busqueda}%` } },
          { "$Agentes.apellido$": { [Op.iLike]: `%${busqueda}%` } },
        ],
      },
      include: [
        {
          model: Agente,
          through: TareaAgente,
          attributes: ["id", "nombre", "apellido"],
        },
      ],
      distinct: true,
    });
    return this.getAllTareasConAgentes(tareas);
  } catch (error) {
    console.error("Error al buscar tareas:", error);
    throw error;
  }
};

exports.getTareasIncompletasPorAgente = async (agenteId) => {
  let data;
  const idAgente = parseInt(agenteId);
  if (idAgente === -1) {
    // Si agenteId es 0, obtenemos todas las tareas incompletas sin filtrar por agente
    data = await Tarea.findAll({
      where: {
        estado: {
          [Op.ne]: "Finalizado", // Excluye las tareas con estado "finalizado"
        },
      },
      include: [
        {
          model: Agente,
          through: { attributes: [] },
          attributes: ["nombre", "apellido"],
        },
      ],
    });
  } else {
    // Si agenteId no es 0, filtramos por el ID del agente
    data = await Tarea.findAll({
      where: {
        estado: {
          [Op.ne]: "Finalizado", // Excluye las tareas con estado "finalizado"
        },
      },
      include: [
        {
          model: Agente,
          where: { id: idAgente }, // Filtra por el ID del agente logueado
          through: { attributes: [] },
          attributes: ["nombre", "apellido"],
        },
      ],
    });
  }
  return data;
};

exports.cambiarNotificacion = async (idTarea, idNotificacion, estado) => {
  try {
    // Buscar la notificación asociada a la tarea y con el id proporcionado
    const notificacion = await notificacionView.actualizarNotificacion(
      idTarea,
      idNotificacion,
      estado
    );
    // Devolver la notificación actualizada
    return notificacion;
  } catch (error) {
    console.error("Error al cambiar el estado de la notificación:", error);
    throw error; // Re-lanzar el error para ser manejado en el controlador
  }
};

exports.getTareasPorAgente = async (agenteId) => {
  try {
    const tareas = await Tarea.findAll({
      include: [
        {
          model: Agente,
          where: { id: agenteId }, // Filtra por el ID del agente
          through: { attributes: [] }, // Solo es necesario para la relación muchos a muchos
          attributes: ["id", "nombre", "apellido"],
        },
      ],
    });

    return tareas;
  } catch (error) {
    console.error("Error al obtener las tareas completas por agente:", error);
    throw error; // Re-lanza el error para ser manejado en el controlador
  }
};

exports.getReporteAgente = async (agente, inicio, fin) => {
  try {
    const whereClause = {
      [Op.or]: [
        {
          fecha_vencimiento: {
            [Op.between]: [inicio, fin],
          },
        },
        {
          fecha_inicio: {
            [Op.between]: [inicio, fin],
          },
        },
        {
          fecha_finalizado: {
            [Op.between]: [inicio, fin],
          },
        },
      ],
    };

    if (agente !== "todos") {
      whereClause["$Agentes.id$"] = parseInt(agente, 10);
    }

    const tareas = await Tarea.findAll({
      where: whereClause,
      include: [
        {
          model: Agente,
          through: { model: TareaAgente, attributes: [] },
          attributes: ["id", "nombre", "apellido"],
          required: true,
        },
      ],
    });

    const tareasCompletas = await Promise.all(
      tareas.map(async (tarea) => {
        return await exports.getTareaCompletaPorId(tarea.id);
      })
    );

    return tareasCompletas;
  } catch (error) {
    console.error("Error al obtener el reporte de tareas del agente:", error);
    throw error;
  }
};

const Tarea = require('../models/Tarea');
const Agente = require('../models/Agente');
const Revision = require('../models/Revision');
const { Op } = require('sequelize');

// Obtener todas las tareas con agentes asociados
exports.getAllTareasConAgentes = async () => {
  return await Tarea.findAll({
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ['nombre', 'apellido']
      }
    ]
  });
};

// Crear una tarea con agentes asociados
exports.createTareaConAgentes = async (tareaData, agentesIds) => {
  // Crear la nueva tarea
  const nuevaTarea = await Tarea.create(tareaData);

  // Asociar agentes si se proporcionaron agentesIds
  if (agentesIds && agentesIds.length > 0) {
    const agentes = await Agente.findAll({
      where: {
        id: agentesIds
      }
    });
    await nuevaTarea.addAgentes(agentes); // Método de Sequelize para asociar agentes
  }

  return nuevaTarea;
};

// Obtener una tarea por ID con agentes asociados
exports.getTareaPorIdConAgentes = async (id) => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ['nombre', 'apellido']
      }
    ]
  });
};

// Obtener una tarea con detalles completos: agentes y revisiones
exports.getTareaRevisionesPorId = async (id) => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ['nombre', 'apellido']
      },
      {
        model: Revision
      }
    ]
  });
};

exports.getTareasPorRangoDeFechas = async (fechaInicio, fechaFin) => {
  return await Tarea.findAll({
    where: {
      fecha_vencimiento: {
        [Op.gte]: fechaInicio, // Fecha de vencimiento mayor o igual a hoy
        [Op.lte]: fechaFin     // Fecha de vencimiento menor o igual a la fecha proporcionada
      }
    },
    include: [
      {
        model: Agente,
        through: { attributes: [] },
        attributes: ['nombre', 'apellido']
      }
    ]
  });
};
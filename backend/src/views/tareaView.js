const Tarea = require('../models/Tarea');
const Agente = require('../models/Agente');
const Revision = require('../models/Revision');
const Correccion = require('../models/Correccion');
const { Op, Sequelize } = require('sequelize');
const sequelize = require('../config/database');
const TareaAgente = require('../models/TareaAgente')

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
exports.getAgentesPorTarea = async (id) => {
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
exports.getRevisionesPorTarea = async (id) => {
  return await Tarea.findByPk(id, {
    include: [
      {
        model: Revision,
        include: [
          {
            model: Correccion,
            through: { attributes: [] }
          }
        ]
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

exports.getTareaCompletaPorId = async (id) => {
  try {
    // Guardar el resultado de la consulta en una variable
    const tareaCompleta = await Tarea.findByPk(id, {
      include: [
        {
          model: Agente,
          through: { attributes: [] },  // Solo es necesario para la relación muchos a muchos
          attributes: ['id', 'nombre', 'apellido']
        },
        {
          model: Revision,
          include: [
            {
              model: Correccion,  // No se necesita el atributo `through` aquí
            }
          ]
        }
      ]
    });

    // Devolver la tarea completa
    return tareaCompleta;
  } catch (error) {
    console.error('Error al obtener la tarea completa:', error);
    throw error; // Re-lanza el error para ser manejado en el controlador
  }
};

exports.buscarTareas = async (busqueda, isDate) => {
  try {
    const tareas = await Tarea.findAll({
      where: {
        [Op.or]: [
          { nombre: { [Op.iLike]: `%${busqueda}%` } },
          { descripcion: { [Op.iLike]: `%${busqueda}%` } },
          Sequelize.where(
            Sequelize.fn('TO_CHAR', Sequelize.col('fecha_inicio'), 'YYYY-MM-DD'),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          Sequelize.where(
            Sequelize.fn('TO_CHAR', Sequelize.col('fecha_vencimiento'), 'YYYY-MM-DD'),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          Sequelize.where(
            Sequelize.fn('TO_CHAR', Sequelize.col('fecha_finalizado'), 'YYYY-MM-DD'),
            { [Op.iLike]: `%${busqueda}%` }
          ),
          { '$Agentes.nombre$': { [Op.iLike]: `%${busqueda}%` } },
          { '$Agentes.apellido$': { [Op.iLike]: `%${busqueda}%` } },
        ]
      },
      include: [{
        model: Agente,
        through: TareaAgente,
        attributes: ['id', 'nombre', 'apellido'],
      }],
      distinct: true,
    });

    // Cargar todos los agentes asociados a cada tarea
    const tareasConTodosLosAgentes = await Promise.all(tareas.map(async (tarea) => {
      const tareaCompleta = await Tarea.findByPk(tarea.id, {
        include: [{
          model: Agente,
          through: TareaAgente,
          attributes: ['id', 'nombre', 'apellido'],
        }],
      });
      return tareaCompleta;
    }));

    return tareasConTodosLosAgentes;
  } catch (error) {
    console.error('Error al buscar tareas:', error);
    throw error;
  }
};

exports.getTareasIncompletasPorAgente = async (agenteId) => {

  return await Tarea.findAll({
    where: {
      estado: {
        [Op.ne]: 'Finalizado' // Excluye las tareas con estado "finalizado"
      }
    },
    include: [
      {
        model: Agente,
        where: { id: agenteId }, // Filtra por el ID del agente logueado
        through: { attributes: [] },
        attributes: ['nombre', 'apellido']
      }
    ]
  });
};
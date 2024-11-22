const TareaView = require('../views/tareaView');
const Tarea = require('../models/Tarea');
const { Op } = require('sequelize');
const Agente = require('../models/Agente')
const moment = require('moment');

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
      res.status(404).json({ error: 'Tarea no encontrada' });
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
    return res.status(400).json({ error: 'Se requiere una fecha de vencimiento.' });
  }

  try {
    // Realizar la consulta de tareas
    const tareas = await TareaView.getTareasPorRangoDeFechas(fechaInicio, fechaFinDate);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva tarea con agentes asociados
exports.createTarea = async (req, res) => {
  const { ...tareaData } = req.body;
  const agentesIds = req.body.agentesIds

  try {
    const nuevaTarea = await TareaView.createTareaConAgentes(tareaData, agentesIds);
    res.status(201).json(nuevaTarea);
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
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    // Actualizar los datos de la tarea
    await tarea.update(tareaData);

    if (agentesIds && agentesIds.length > 0) {
      const agentes = await Agente.findAll({
        where: {
          id: agentesIds, // Esto buscará todos los agentes cuyos IDs están en el array agentesIds
        },
      });
      //Actualizar la relación muchos a muchos
      await tarea.setAgentes(agentes);

      // Obtener la tarea actualizada con los agentes
      const tareaActualizada = await TareaView.getAgentesPorTarea(id)
      res.json(tareaActualizada)
    } else {
      res.json(tareaData)
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// Eliminar una tarea
exports.deleteTarea = async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    await tarea.destroy();
    res.json({ message: 'Tarea eliminada correctamente' });
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
      res.status(404).json({ error: 'Agentes no encontrados' });
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
      res.status(404).json({ error: 'Revisiones no encontradas' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.buscarTareas = async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "El parámetro de búsqueda no puede estar vacío" });
  }
  // Verificar si el query es una fecha válida
  const isDate = moment(query, 'YYYY-MM-DD', true).isValid();

  try {
    const tareas = await TareaView.buscarTareas(query, isDate);
    res.json(tareas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTareasIncompletas = async (req, res) => {
  try {
    const agenteId = req.params.id; // Obtiene el ID del agente logueado desde req.params
    const tareasIncompletas = await TareaView.getTareasIncompletasPorAgente(agenteId);

    res.status(200).json(tareasIncompletas);
  } catch (error) {
    console.error('Error al obtener tareas incompletas:', error);
    res.status(500).json({ error: 'Ocurrió un error al obtener las tareas incompletas' });
  }
};

exports.cambiarEstados = async (req, res) => {
  try {
    const { estado } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud
    const { id } = req.params; // Obtener el id de la tarea desde los parámetros

    // Verificar que el estado sea válido
    const estadosValidos = [
      'Sin comenzar',
      'Curso',
      'Revisión',
      'Confirmación de revisión',
      'Corrección',
      'Bloqueada',
      'Finalizado',
    ];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    // Actualizar el estado de la tarea
    const tarea = await Tarea.findByPk(id); // Buscar la tarea por ID
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    tarea.estado = estado; // Cambiar el estado
    await tarea.save(); // Guardar los cambios

    return res.status(200).json({ message: 'Estado actualizado con éxito', tarea });
  } catch (error) {
    console.error('Error al cambiar de estado:', error);
    return res.status(500).json({ error: 'Error al cambiar el estado de la tarea' });
  }
};
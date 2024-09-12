const TareaView = require('../views/tareaView');
const Tarea = require('../models/Tarea');
const { Op } = require('sequelize');
const Agente = require('../models/Agente')

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
    const tarea = await TareaView.getTareaPorIdConAgentes(id);
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


// Obtener una tarea con detalles completos: agentes y revisiones
exports.getTareaRevision = async (req, res) => {
  const { id } = req.params;
  try {
    const tarea = await TareaView.getTareaRevisionesPorId(id);
    if (tarea) {
      res.status(200).json(tarea);
    } else {
      res.status(404).json({ error: 'Tarea no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva tarea con agentes asociados
exports.createTarea = async (req, res) => {
  const { agentesIds, ...tareaData } = req.body;
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
  const { agentesIds, ...tareaData } = req.body; // Extraer agentesIds y otros datos de la tarea

  try {
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Actualizar los datos de la tarea
    await tarea.update(tareaData);

    // Si hay agentes asociados (agentesIds), actualizarlos

    if (agentesIds && agentesIds.length > 0) {
      const agentes = await Agente.findAll({
        where: {
          id: agentesIds, // Esto buscará todos los agentes cuyos IDs están en el array agentesIds
        },
      });

      //Actualizar la relación muchos a muchos
      await tarea.setAgentes(agentes); // Método de Sequelize para actualizar la relación
    }

    // Obtener la tarea actualizada con los agentes
    const tareaActualizada = await TareaView.getTareaPorIdConAgentes(id);
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
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
    await tarea.destroy();
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
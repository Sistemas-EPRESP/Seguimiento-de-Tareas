const Revision = require('../models/Revision');
const Tarea = require('../models/Tarea');

// Obtener revisiones asociadas a una tarea
exports.getRevisionesPorTarea = async (tareaId) => {
  const revisiones = await Revision.findAll({
    where: { tareaId },
  });

  return revisiones;
};

// Crear una revisión asociada a una tarea
exports.createRevisionConTarea = async (tareaId, revisionData) => {
  // Verificar si la tarea existe
  const tarea = await Tarea.findByPk(tareaId);
  if (!tarea) {
    throw new Error('Tarea no encontrada');
  }

  const nuevaRevision = await Revision.create({
    ...revisionData,
    tareaId,
  });

  return nuevaRevision;
};
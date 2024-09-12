const Revision = require('../models/Revision');
const RevisionView = require('../views/revisionView');

// Obtener todas las revisiones
exports.getAllRevisiones = async (req, res) => {
  try {
    const revisiones = await Revision.findAll();
    res.status(200).json(revisiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las revisiones de una tarea
exports.getRevisionsByTarea = async (req, res) => {
  const { tareaId } = req.params;
  try {
    const revisiones = await RevisionView.getRevisionesPorTarea(tareaId); // Utiliza la vista
    res.status(200).json(revisiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una revisión asociada a una tarea
exports.createRevision = async (req, res) => {
  const { tareaId } = req.params;
  const { descripcion, fecha_hora } = req.body;

  try {
    const nuevaRevision = await RevisionView.createRevisionConTarea(tareaId, { descripcion, fecha_hora });
    res.status(201).json(nuevaRevision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una revisión
exports.updateRevision = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_hora } = req.body;

  try {
    // Verificar si la revisión existe
    const revision = await Revision.findByPk(id);
    if (!revision) {
      return res.status(404).json({ error: 'Revisión no encontrada' });
    }

    // Actualizar la revisión
    await revision.update({ descripcion, fecha_hora });
    res.status(200).json(revision);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una revisión
exports.deleteRevision = async (req, res) => {
  const { id } = req.params;
  try {
    const revision = await Revision.findByPk(id);
    if (!revision) {
      return res.status(404).json({ error: 'Revisión no encontrada' });
    }
    await revision.destroy();
    res.status(200).json({ message: 'Revisión eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
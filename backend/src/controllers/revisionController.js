const RevisionView = require('../views/revisionView');
const Tarea = require('../models/Tarea');
const Revision = require('../models/Revision');
const Correccion = require('../models/Correccion');


// Obtener todas las revisiones de una tarea, incluyendo correcciones
exports.getRevisionsByTarea = async (req, res) => {
  const { tareaId } = req.params;
  try {
    const revisiones = await RevisionView.getRevisionesPorTarea(tareaId);
    res.status(200).json(revisiones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una revisión asociada a una tarea con correcciones
exports.createRevision = async (req, res) => {
  const { id } = req.params; // ID de la tarea
  const { fecha_hora, correcciones } = req.body; // Datos del cuerpo de la solicitud

  try {
    // Verificar si la tarea existe
    const tarea = await Tarea.findByPk(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Crear la nueva revisión y las correcciones
    const revision = await RevisionView.createRevision(id, fecha_hora, correcciones);

    // Volver a buscar la revisión con las correcciones asociadas
    const revisionConCorrecciones = await Revision.findByPk(revision.id, {
      include: [
        {
          model: Correccion,
          as: 'Correccions', // Asegúrate de que este alias coincida con el definido en tu modelo
        },
      ],
    });

    // Devolver la respuesta con la revisión y sus correcciones
    res.status(201).json(revisionConCorrecciones);
  } catch (error) {
    console.error('Error al crear la revisión:', error);
    res.status(500).json({ error: 'Ocurrió un error al crear la revisión' });
  }
};

exports.updateRevision = async (req, res) => {
  const { id } = req.params;
  const { descripcion, fecha_hora, correcciones } = req.body;

  try {
    // Verificar si la revisión existe
    const revision = await Revision.findByPk(id);
    if (!revision) {
      return res.status(404).json({ error: 'Revisión no encontrada' });
    }

    // Actualizar la revisión
    await revision.update({ descripcion, fecha_hora });

    // Actualizar las correcciones asociadas a la revisión
    if (correcciones && correcciones.length > 0) {
      // Eliminar correcciones existentes
      await Correccion.destroy({ where: { revisionId: id } });

      // Crear nuevas correcciones
      await Correccion.bulkCreate(
        correcciones.map((c) => ({ ...c, revisionId: id }))
      );
    }

    // Comprobar y actualizar el estado de la revisión
    await checkAndUpdateRevisionStatus(id);

    const revisionConCorrecciones = await RevisionView.getRevisionPorId(id);
    res.status(200).json(revisionConCorrecciones);
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
    await Correccion.destroy({ where: { revisionId: id } }); // Eliminar correcciones asociadas
    res.status(200).json({ message: 'Revisión eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateCorreccionesEstado = async (req, res) => {
  const revisiones = req.body; // Recibe el array de revisiones

  try {
    for (const revision of revisiones) {
      const { id: revisionId, Correccions } = revision;

      // Iterar por cada corrección y actualizar su estado
      for (const correccion of Correccions) {
        const { id: correccionId, estado } = correccion;

        // Encontrar la corrección por ID
        const correccionInstance = await Correccion.findByPk(correccionId);
        if (!correccionInstance) {
          return res
            .status(404)
            .json({ error: `Corrección con ID ${correccionId} no encontrada` });
        }

        // Actualizar el estado de la corrección
        await correccionInstance.update({ estado });
      }

      // Verificar y actualizar el estado de la revisión si es necesario
      await checkAndUpdateRevisionStatus(revisionId);
    }

    // Retornar un mensaje de éxito
    return res.status(200).json({ message: 'Correcciones actualizadas exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el estado de las correcciones:', error);
    return res.status(500).json({ error: 'Error al actualizar las correcciones' });
  }
};

// Función para comprobar si todas las correcciones de una revisión están completas
const checkAndUpdateRevisionStatus = async (revisionId) => {
  try {
    // Obtener la revisión y sus correcciones
    const revision = await Revision.findByPk(revisionId, {
      include: [{ model: Correccion }],
    });

    if (!revision) {
      console.error(`Revisión con ID ${revisionId} no encontrada`);
      return;
    }

    // Verificar si todas las correcciones tienen estado 'true'
    const allCorrectionsApplied = revision.Correccions.every(
      (correccion) => correccion.estado === true
    );

    // Si todas las correcciones están aplicadas, actualizar el estado de la revisión
    if (allCorrectionsApplied) {
      await revision.update({ estado: true });
    }
  } catch (error) {
    console.error('Error al verificar y actualizar el estado de la revisión:', error);
  }
};

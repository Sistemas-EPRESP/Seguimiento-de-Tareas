const Revision = require("../models/Revision");
const Correccion = require("../models/Correccion");
const Notificacion = require("../models/Notificacion");

// Obtener revisiones asociadas a una tarea, incluyendo sus correcciones
exports.getRevisionesPorTarea = async (tareaId) => {
  const revisiones = await Revision.findAll({
    where: { tareaId },
    include: [
      {
        model: Correccion, // Incluye las correcciones de cada revisión
      },
    ],
  });

  return revisiones;
};

// Crear una revisión asociada a una tarea con sus correcciones
exports.createRevision = async (tareaId, fecha_hora, correcciones) => {
  try {
    // Crear la revisión para la tarea
    const nuevaRevision = await Revision.create({
      tareaId,
      fecha_hora,
    });

    // Si se proporcionan correcciones, crearlas y asociarlas a la revisión
    if (correcciones && correcciones.length > 0) {
      for (const correccion of correcciones) {
        await Correccion.create({
          tipo: correccion.tipo,
          estado: correccion.estado || false, // Estado por defecto es falso si no se proporciona
          revisionId: nuevaRevision.id, // Relacionar con la nueva revisión
        });
      }
    }

    // Crear notificación
    await Notificacion.create({
      titulo: "Nuevas revisiones",
      mensaje: "Se han agregado revisiones a su tarea.",
      estado: "Pendiente",
      tareaId,
    });

    // Comprobar y actualizar el estado de la revisión
    await checkAndUpdateRevisionStatus(nuevaRevision.id);

    // Retornar la revisión con las posibles correcciones asociadas
    return nuevaRevision;
  } catch (error) {
    console.error("Error al crear la revisión y correcciones:", error);
    throw error; // Lanza el error para que sea capturado por el controlador
  }
};

// Obtener una revisión por ID, incluyendo sus correcciones
exports.getRevisionPorId = async (revisionId) => {
  const revision = await Revision.findByPk(revisionId, {
    include: [
      {
        model: Correccion, // Incluye las correcciones directamente
      },
    ],
  });

  return revision;
};

// Función para comprobar y actualizar el estado de la revisión
const checkAndUpdateRevisionStatus = async (revisionId) => {
  // Obtener la revisión con sus correcciones
  const revision = await Revision.findByPk(revisionId, {
    include: [{ model: Correccion }],
  });

  // Verificar si todas las correcciones tienen estado true
  const allCorrectionsApplied = revision.Correccions.every(
    (correccion) => correccion.estado === true
  );

  // Si todas las correcciones están aplicadas, actualizar el estado de la revisión
  if (allCorrectionsApplied) {
    await revision.update({ estado: true });
  }
};

exports.calcularRevisiones = (tareas) => {
  const tiposDeCorreccion = [
    "Ortografía",
    "Formato",
    "Contenido",
    "Modificación de contenido",
    "Redacción",
    "Citas incorrectas",
    "No corresponde a lo solicitado",
    "Información incorrecta",
    "Error de calculo",
    "Tarea incompleta",
    "Falta de documentación adjunta",
  ];

  const correccionesContador = tiposDeCorreccion.reduce((acc, tipo) => {
    acc[tipo] = 0;
    return acc;
  }, {});

  tareas.forEach((tarea) => {
    tarea.Revisions.forEach((revision) => {
      revision.Correccions.forEach((correccion) => {
        if (correccionesContador.hasOwnProperty(correccion.tipo)) {
          correccionesContador[correccion.tipo]++;
        }
      });
    });
  });

  return correccionesContador;
};

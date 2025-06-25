const Notificacion = require("../models/Notificacion");

exports.crearNotificacion = async (tareaId, infoNotificar) => {
  return await Notificacion.create({
    titulo: infoNotificar.titulo,
    mensaje: infoNotificar.mensaje,
    estado: "Pendiente", // Estado predeterminado
    tareaId: tareaId, // Asocia la notificación a la tarea
  });
};

exports.actualizarNotificacion = async (idTarea, idNotificacion, estado) => {
  try {
    const notificacion = await Notificacion.findOne({
      where: {
        id: idNotificacion,
        tareaId: idTarea, // Asegurarse de que pertenezca a la tarea indicada
      },
    });
    // Si no se encuentra la notificación, lanzar un error
    if (!notificacion) {
      throw new Error("Notificación no encontrada o no asociada a esta tarea.");
    }

    // Actualizar el estado de la notificación
    notificacion.estado = estado;
    await notificacion.save();

    return notificacion;
  } catch (error) {
    throw Error("Error al cambia de estado la notificacion");
  }
};

exports.limpiarNotificacionesRepetidasCambioPlazo = async (tareaId) => {
  try {
    const notificacionesPendientes = await Notificacion.findAll({
      where: { tareaId, titulo: "Cambio de plazo", estado: "Pendiente" },
    });
    await Promise.all(
      notificacionesPendientes.map((notificacion) => notificacion.destroy())
    );
  } catch (err) {}
};

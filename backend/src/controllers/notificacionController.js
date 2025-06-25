const Notificacion = require("../models/Notificacion");
const TareaView = require("../views/tareaView");
const notificacionView = require("../views/notificacionView");

exports.crearNotificacion = async (req, res) => {
  const { id } = req.params;
  const infoNotificar = req.body;

  // chequear si ya hay una notificación pendiente de cambio de plazo, y en ese caso eliminarla
  await notificacionView.limpiarNotificacionesRepetidasCambioPlazo(id);

  try {
    const notificacion = await notificacionView.crearNotificacion(
      id,
      infoNotificar
    );
    res.status(201).json(notificacion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.actualizarNotificacion = async (req, res) => {
  try {
    const { idNotificacion, estado } = req.body; // Obtener el nuevo estado desde el cuerpo de la solicitud
    const idTarea = req.params.id; // Obtener el id de la tarea desde los parámetros

    const estadosValidos = ["Aceptada", "Pendiente", "Declinada"];

    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    const data = await TareaView.cambiarNotificacion(
      idTarea,
      idNotificacion,
      estado
    );

    return res
      .status(200)
      .json({ message: "Estado actualizado con éxito", data });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrió un error al confirmar la notificación" });
  }
  return 0;
};

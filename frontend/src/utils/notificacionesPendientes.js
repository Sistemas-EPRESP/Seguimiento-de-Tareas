export const hayNotificacionesPendientes = (tarea) => {
  const resp = tarea?.Notificacions?.some(
    (notificacion) =>
      notificacion.estado === "Pendiente" &&
      (notificacion.titulo === "Finalizacion de tarea" ||
        notificacion.titulo === "Finalizacion de correcciones")
  );
  console.log("Para tarea id:", tarea.id, resp);
  console.log("Notificaciones: ", tarea.Notificacions);
  return resp;
};

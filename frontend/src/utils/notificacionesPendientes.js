export const hayNotificacionesPendientesParaAdmin = (tarea) => {
  const resp = tarea?.Notificacions?.some(
    (notificacion) =>
      notificacion.estado === "Pendiente" &&
      (notificacion.titulo === "Finalizacion de tarea" ||
        notificacion.titulo === "Finalizacion de correcciones")
  );
  return resp;
};

export const hayNotificacionesPendientesParaPersonal = (tarea) => {
  const resp = tarea?.Notificacions?.some(
    (notificacion) =>
      notificacion.estado === "Pendiente" &&
      (notificacion.titulo === "Nuevas revisiones" ||
        notificacion.titulo === "Cambio de plazo")
  );
  return resp;
};

export const hayNotificacionesCambioPlazo = (tarea) =>
  tarea?.Notificacions?.some(
    (notificacion) =>
      notificacion.estado === "Pendiente" &&
      notificacion.titulo === "Cambio de plazo"
  );

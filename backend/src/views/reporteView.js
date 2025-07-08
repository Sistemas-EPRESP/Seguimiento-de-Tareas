const RevisionView = require("../views/revisionView");

exports.generarReporte = (tareas) => {
  return tareas.map((tarea) => {
    const correccionesContador = RevisionView.calcularRevisiones([tarea]);
    const correcciones = Object.entries(correccionesContador).reduce(
      (acc, [tipo, cantidad]) => {
        acc[tipo] = cantidad;
        return acc;
      },
      {}
    );

    const agente = tarea.Agentes[0] || { nombre: "", apellido: "" };

    return {
      id: tarea.id,
      nombre: tarea.nombre,
      Correcciones: correcciones,
      agenteNombre: agente.nombre,
      agenteApellido: agente.apellido,
    };
  });
};

const agruparTareasPorEstado = (tareas) => {
  const estados = [
    "Sin comenzar",
    "Curso",
    "Revisión",
    "Corrección",
    "Bloqueada",
    "Finalizado",
  ];
  const tareasPorEstado = estados.reduce((acc, estado) => {
    acc[estado] = [];
    return acc;
  }, {});

  tareas.forEach((tarea) => {
    if (tareasPorEstado[tarea.estado]) {
      tareasPorEstado[tarea.estado].push(tarea);
    }
  });

  return tareasPorEstado;
};

exports.clasificarTareas = (tareas) => {
  return agruparTareasPorEstado(tareas);
};

exports.getTareasVencidas = (tareas) => {
  const now = new Date();
  return tareas.filter((tarea) => {
    const fechaEntrega = new Date(tarea.fecha_de_entrega);

    const finalizacionMovimiento = tarea.HistorialMovimientos.find(
      (movimiento) => movimiento.tipo === "Finalización"
    );

    const fechaFinalizacion = finalizacionMovimiento
      ? new Date(finalizacionMovimiento.fecha)
      : null;

    return (
      (tarea.estado !== "Finalizado" && fechaEntrega < now) ||
      (fechaFinalizacion && fechaFinalizacion > fechaEntrega)
    );
  });
};

const RevisionView = require('../views/revisionView');

exports.generarReporte = (tareas) => {
  return tareas.map(tarea => {
    const correccionesContador = RevisionView.calcularRevisiones([tarea]);
    const correcciones = Object.entries(correccionesContador).reduce((acc, [tipo, cantidad]) => {
      acc[tipo] = cantidad;
      return acc;
    }, {});

    return {
      id: tarea.id,
      nombre: tarea.nombre,
      Correcciones: correcciones
    };
  });
}

const getTareasVencidas = (tareas) => {
  const now = new Date();
  return tareas.filter(tarea =>
    (tarea.estado === 'Sin comenzar' || tarea.estado === 'Curso') && new Date(tarea.fecha_de_entrega) < now ||
    (tarea.estado === 'Correcciones' && new Date(tarea.fecha_limite) < now)
  );
}

const getTareasActivas = (tareas) => {
  const now = new Date();
  return tareas.filter(tarea =>
    (tarea.estado === 'Curso' && new Date(tarea.fecha_de_entrega) >= now) ||
    ((tarea.estado === 'Revision' || tarea.estado === 'Correcciones') && new Date(tarea.fecha_limite) >= now)
  );
}

const getTareasFuturas = (tareas) => {
  const now = new Date();
  return tareas.filter(tarea =>
    (tarea.estado === 'Sin comenzar' || tarea.estado === 'Bloqueada') && new Date(tarea.fecha_inicio) > now
  );
}

const getTareasCompletadas = (tareas) => {
  return tareas.filter(tarea => tarea.estado === 'Finalizado');
}

exports.clasificarTareas = (tareas) => {
  return {
    'Tareas vencidas': getTareasVencidas(tareas),
    'Tareas activas': getTareasActivas(tareas),
    'Tareas futuras': getTareasFuturas(tareas),
    'Tareas completadas': getTareasCompletadas(tareas)
  };
}

// const getTareasCompletadas = (tareas) => {
//   return tareas.filter(tarea => tarea.estado === 'Finalizado').length;
// }

// const getTareasSinFinalizar = (tareas) => {
//   return tareas.filter(tarea => tarea.estado !== 'Finalizado').length;
// }

// const getTareasIncompletas = (tareas) => {
//   const now = new Date();
//   return tareas.filter(tarea =>
//     (tarea.estado === 'Sin comenzar' || tarea.estado === 'Curso') &&
//     new Date(tarea.fecha_vencimiento) < now
//   ).length;
// }

// const getReporteRevisiones = (tareas) => {
//   const correccionesContador = RevisionView.calcularRevisiones(tareas);
//   return Object.entries(correccionesContador).map(([tipo, cantidad]) => ({
//     tipo,
//     cantidad
//   }));
// }

const express = require('express');
const {
  createRevision,
  updateRevision,
  deleteRevision,
  updateCorreccionesEstado,
} = require('../controllers/revisionController'); // Asegúrate de que la ruta sea correcta

const router = express.Router();

// Asegúrate de que las rutas están correctamente asociadas a funciones de callback


router.post('/tareas/:tareaId/revisiones', createRevision);          // Crear una revisión para una tarea específica
router.put('/revisiones/:id', updateRevision);                       // Actualizar una revisión por ID
router.delete('/revisiones/:id', deleteRevision);                    // Eliminar una revisión por ID
router.put('/correcciones/estado', updateCorreccionesEstado);

module.exports = router;
const express = require('express');
const { getAllRevisiones, createRevision, updateRevision, deleteRevision, getRevisionsByTarea } = require('../controllers/revisionController');
const router = express.Router();

// Rutas para revisiones
router.get('/revisiones', getAllRevisiones);                         // Obtener todas las revisiones
router.post('/tareas/:tareaId/revisiones', createRevision);          // Crear una revisión para una tarea específica
router.put('/revisiones/:id', updateRevision);                       // Actualizar una revisión por ID
router.delete('/revisiones/:id', deleteRevision);                    // Eliminar una revisión por ID
router.get('/tareas/:tareaId/revisiones', getRevisionsByTarea);      // Obtener todas las revisiones de una tarea específica

module.exports = router;

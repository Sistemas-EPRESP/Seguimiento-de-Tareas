const express = require('express');
const { getAllTareas, createTarea, updateTarea, deleteTarea, getTareaById, getTareaRevision, getTareasByDateRange } = require('../controllers/tareaController');

const router = express.Router();

// Coloca la ruta más específica primero
router.get('/tareas/fecha', getTareasByDateRange); // Obtener tareas por rango de fechas

// Luego coloca las rutas con parámetros
router.get('/tareas/:id/revisiones', getTareaRevision); // Obtener una tarea con agente y revisiones
router.get('/tareas/:id', getTareaById);      // Obtener una tarea por ID

// Finalmente las otras rutas
router.get('/tareas', getAllTareas);          // Obtener todas las tareas
router.post('/tareas', createTarea);          // Crear una nueva tarea
router.put('/tareas/:id', updateTarea);       // Actualizar una tarea por ID
router.delete('/tareas/:id', deleteTarea);    // Eliminar una tarea por ID

module.exports = router;
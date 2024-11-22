const express = require('express');
const {
  getAllTareas,
  createTarea,
  updateTarea,
  getTareaById,
  deleteTarea,
  getTareaAgentes,
  getTareaRevisiones,
  getTareasByDateRange,
  buscarTareas,
  getTareasIncompletas,
  cambiarEstados,
} = require('../controllers/tareaController');

const { createRevision } = require("../controllers/revisionController")

const router = express.Router();

// Rutas específicas
router.get('/tareas/fecha', getTareasByDateRange); // Obtener tareas por rango de fechas
router.get('/tareas/buscar', buscarTareas); // Nueva ruta para buscar tareas por query
router.get('/tareas/incompletas/:id', getTareasIncompletas); // Obtener agentes de una tarea
router.get('/tareas/:id/agentes', getTareaAgentes); // Obtener agentes de una tarea
router.get('/tareas/:id/revisiones', getTareaRevisiones); // Obtener revisiones de una tarea
router.post('/tareas/:id/revisiones', createRevision); // Obtener revisiones de una tarea
router.get('/tareas/:id', getTareaById)

// Otras rutas
router.get('/tareas', getAllTareas);          // Obtener todas las tareas
router.post('/tareas', createTarea);          // Crear una nueva tarea
router.put('/tareas/:id/cambiarEstado', cambiarEstados)
router.put('/tareas/:id', updateTarea);       // Actualizar una tarea por ID
router.delete('/tareas/:id', deleteTarea);    // Eliminar una tarea por ID

module.exports = router;  
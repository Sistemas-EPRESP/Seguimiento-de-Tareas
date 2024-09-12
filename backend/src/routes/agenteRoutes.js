const express = require('express');
const router = express.Router();
const { getAllAgentes, getAgenteById, createAgente, updateAgente, deleteAgente } = require('../controllers/agenteController');

router.get('/agentes', getAllAgentes);
router.post('/agentes', createAgente);
router.get('/agentes/:id', getAgenteById);
router.put('/agentes/:id', updateAgente);
router.delete('/agentes/:id', deleteAgente);

module.exports = router;
const express = require('express');
const { getReportes, getReportesVencimientos } = require('../controllers/reportesController');

const router = express.Router();

router.get('/reportes/vencimientos', getReportesVencimientos);
router.get('/reportes', getReportes);

module.exports = router;
const express = require("express");
const {
  getReportes,
  getReportesTareasEstados,
  getReportesVencimientos,
} = require("../controllers/reportesController");

const router = express.Router();

router.get("/reportes/tareasEstados", getReportesTareasEstados);
router.get("/reportes/vencimientos", getReportesVencimientos);
router.get("/reportes", getReportes);

module.exports = router;

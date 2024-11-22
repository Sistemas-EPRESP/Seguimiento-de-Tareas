const express = require('express');
const router = express.Router();
const { login, verifyLogin } = require('../controllers/authController');
//const { } = require('../controllers/authController')
const verifyToken = require("../middlewares/authMiddleware");

// Ruta para verificar el token
router.get("/verify-login", verifyToken, verifyLogin);
router.post('/login', login);

module.exports = router;
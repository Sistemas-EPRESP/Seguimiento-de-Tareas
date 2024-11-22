// middleware/auth.js
const jwt = require("jsonwebtoken");
const config = require("../config/config"); // Importar el secreto del JWT desde tu archivo de configuración

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Obtener el token del header

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado. Token no proporcionado." });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret); // Verificar el token con el secreto

    req.usuario = decoded; // Almacenar el usuario decodificado en la solicitud
    next(); // Pasar al siguiente middleware o ruta
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};

module.exports = verifyToken;
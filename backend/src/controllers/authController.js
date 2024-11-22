const Agente = require('../models/Agente'); // Importar modelos
const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config'); // Donde defines tu JWT secret

// Controlador de autenticación
const login = async (req, res) => {
  const { nombre, apellido, password } = req.body;

  try {
    // Buscar al agente por nombre y apellido
    const agente = await Agente.findOne({
      where: { nombre, apellido },
    });

    if (!agente) {
      return res.status(404).json({ message: 'Agente no encontrado' });
    }

    // Buscar al usuario relacionado con el agente
    const usuario = await Usuario.findOne({
      where: { agenteId: agente.id },
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Comparar la contraseña proporcionada con la almacenada en el usuario
    const passwordMatch = await bcrypt.compare(password, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Crear un token JWT

    const token = jwt.sign({ id: usuario.id, rol: usuario.rol }, config.jwtSecret, { expiresIn: config.jwtExpireTime });

    // Devolver el token y el rol del usuario
    return res.status(200).json({
      token,
      rol: usuario.rol,
      agente: {
        id: agente.id,
        nombre: agente.nombre,
        apellido: agente.apellido,
      },
    });
  } catch (error) {
    console.error('Error en login', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
};

const verifyLogin = async (req, res) => {
  try {
    // Buscar al usuario en la base de datos con el ID que se decodificó del token
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: ["id", "rol"], // Ajustar los atributos que quieras devolver
      include: {
        model: Agente, // Incluir los datos del Agente asociado
        as: 'agente', // Especifica el alias 'agente' tal como está en las asociaciones
        attributes: ["nombre", "apellido"], // Ajustar los atributos que quieras devolver del agente
      },
    });

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    return res.json(usuario);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al verificar el login." });
  }
};

module.exports = {
  login,
  verifyLogin
};
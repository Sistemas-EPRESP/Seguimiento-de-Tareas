const Agente = require('../models/Agente'); // Importar modelos
const Usuario = require('../models/Usuario')
const bcrypt = require('bcrypt');

// Obtener todos los agentes
exports.getAllAgentes = async (req, res) => {
  try {
    const agentes = await Agente.findAll();
    res.status(200).json(agentes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los agentes' });
  }
};

exports.createAgente = async (req, res) => {
  const { nombre, apellido, rol, password } = req.body;

  try {
    // Crear nuevo agente
    const nuevoAgente = await Agente.create({ nombre, apellido });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario asociado al agente
    const nuevoUsuario = await Usuario.create({
      rol: rol || 'Personal',  // Establecer un rol por defecto si no se proporciona
      password: hashedPassword,
      agenteId: nuevoAgente.id, // Relacionar con el agente creado
    });

    // Responder con el nuevo agente y usuario
    res.status(201).json({
      message: 'Agente y usuario creados con éxito',
      agente: nuevoAgente,
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error('Error al crear el agente y usuario:', error);
    res.status(500).json({ error: 'Error al crear el agente y usuario' });
  }
};

// Obtener un agente por ID
exports.getAgenteById = async (req, res) => {
  const { id } = req.params;
  try {
    const agente = await Agente.findByPk(id);
    if (agente) {
      res.status(200).json(agente);
    } else {
      res.status(404).json({ error: 'Agente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el agente' });
  }
};

// Actualizar un agente
exports.updateAgente = async (req, res) => {
  const { id } = req.params;
  const { nombre, apellido } = req.body;
  try {
    const agente = await Agente.findByPk(id);
    if (agente) {
      agente.nombre = nombre;
      agente.apellido = apellido;
      await agente.save();
      res.status(200).json(agente);
    } else {
      res.status(404).json({ error: 'Agente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el agente' });
  }
};

// Eliminar un agente
exports.deleteAgente = async (req, res) => {
  const { id } = req.params;
  try {
    const agente = await Agente.findByPk(id);
    if (agente) {
      await agente.destroy();
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Agente no encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el agente' });
  }
};
const Agente = require('../models/Agente');

// Obtener todos los agentes
exports.getAllAgentes = async (req, res) => {
  try {
    const agentes = await Agente.findAll();
    res.status(200).json(agentes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los agentes' });
  }
};

// Crear un nuevo agente
exports.createAgente = async (req, res) => {
  const { nombre, apellido } = req.body;
  try {
    const nuevoAgente = await Agente.create({ nombre, apellido });
    res.status(201).json(nuevoAgente);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el agente' });
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
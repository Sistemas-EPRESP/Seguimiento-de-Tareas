const Correccion = require('../models/Correccion');

// Crear una nueva corrección
exports.createCorreccion = async (req, res) => {
  const { tipo } = req.body;

  try {
    // Validar que el tipo esté presente
    if (!tipo) {
      return res.status(400).json({ error: 'El tipo de corrección es obligatorio.' });
    }

    // Crear la nueva corrección
    const nuevaCorreccion = await Correccion.create({ tipo });
    res.status(201).json(nuevaCorreccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las correcciones
exports.getAllCorrecciones = async (req, res) => {
  try {
    const correcciones = await Correccion.findAll();
    res.status(200).json(correcciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una corrección por ID
exports.getCorreccionById = async (req, res) => {
  const { id } = req.params;

  try {
    const correccion = await Correccion.findByPk(id);
    if (correccion) {
      res.status(200).json(correccion);
    } else {
      res.status(404).json({ error: 'Corrección no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una corrección
exports.updateCorreccion = async (req, res) => {
  const { id } = req.params;
  const { tipo } = req.body;

  try {
    const correccion = await Correccion.findByPk(id);
    if (!correccion) {
      return res.status(404).json({ error: 'Corrección no encontrada' });
    }

    // Actualizar la corrección
    await correccion.update({ tipo });
    res.status(200).json(correccion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una corrección
exports.deleteCorreccion = async (req, res) => {
  const { id } = req.params;

  try {
    const correccion = await Correccion.findByPk(id);
    if (!correccion) {
      return res.status(404).json({ error: 'Corrección no encontrada' });
    }

    await correccion.destroy();
    res.status(200).json({ message: 'Corrección eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
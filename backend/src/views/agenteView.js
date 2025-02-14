const Tarea = require('../models/Tarea');
const Agente = require('../models/Agente');
const TareaAgente = require('../models/TareaAgente');
const Usuario = require('../models/Usuario');
const { Op, Sequelize } = require('sequelize');

exports.crearAgente = async (nombre, apellido) => {
  // Validar nombre y apellido
  const { nombre: nombreValidado, apellido: apellidoValidado } = await validarAgente(nombre, apellido);

  // Crear el agente
  return await Agente.create({ nombre: nombreValidado, apellido: apellidoValidado });
};

exports.asignarAgenteATarea = async (agentes) => {

}

exports.getAllAgentesById = async (agentesIds) => {
  try {
    const agentes = await Agente.findAll({
      where: {
        id: agentesIds
      }
    });
    return agentes;
  } catch (error) {
    throw new Error('Ocurrio un error con los agentes');
  }
}

exports.obtenerAgente = async (idAgente) => {
  return await Agente.findByPk(idAgente, {
    include: [
      {
        model: Usuario,
        as: 'usuario', // Asegúrate de usar el alias correcto
        attributes: ['rol'], // Incluir solo el rol del usuario
      },
    ],
  });
};

const validarAgente = async (nombre, apellido) => {
  // Validaciones para nombre y apellido
  if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
    throw new Error('El nombre es requerido y debe ser una cadena de texto no vacía');
  }

  if (!apellido || typeof apellido !== 'string' || apellido.trim().length === 0) {
    throw new Error('El apellido es requerido y debe ser una cadena de texto no vacía');
  }

  // Convertir nombre y apellido a minúsculas
  const nombreMinuscula = nombre.toLowerCase().trim();
  const apellidoMinuscula = apellido.toLowerCase().trim();

  // Verificar si ya existe un agente con el mismo nombre y apellido
  const agenteExistente = await Agente.findOne({
    where: {
      nombre: nombreMinuscula,
      apellido: apellidoMinuscula,
    },
  });

  if (agenteExistente) {
    throw new Error('Ya existe un agente con este nombre y apellido');
  }

  return { nombre: nombreMinuscula, apellido: apellidoMinuscula };
};
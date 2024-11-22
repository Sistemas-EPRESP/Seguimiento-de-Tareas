const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tarea = sequelize.define('Tarea', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fecha_inicio: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_de_entrega: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_limite: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_vencimiento: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  fecha_finalizado: {
    type: DataTypes.DATE,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  prioridad: {
    type: DataTypes.ENUM('Alta', 'Media', 'Baja', 'Periódica'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Sin comenzar', 'Curso', 'Revisión', 'Confirmación de revisión', 'Corrección', 'Bloqueada', 'Finalizado'),
    allowNull: false,
  },
});

module.exports = Tarea;
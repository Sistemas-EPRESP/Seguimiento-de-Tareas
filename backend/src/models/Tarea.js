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
    type: DataTypes.ENUM('alta', 'media', 'baja', 'periódica'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Sin comenzar', 'En curso', 'Bloqueado', 'Completado', 'En revisión'),
    allowNull: false,
  },
});

module.exports = Tarea;
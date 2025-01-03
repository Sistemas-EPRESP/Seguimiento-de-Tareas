const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const HistorialMovimiento = sequelize.define('HistorialMovimiento', {
  tipo: {
    type: DataTypes.ENUM(
      'Crear tarea',
      'Inicio',
      'Revisión',
      'Corrección',
      'Cambio de estado',
      'Finalización',
      'Modificación'
    ),
    allowNull: false,
  },
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: true, // Descripción opcional del movimiento
  },
  fecha: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Fecha del movimiento
  },
  tareaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tareas', // Relación con el modelo Tarea
      key: 'id',
    },
    allowNull: false,
  },
});

module.exports = HistorialMovimiento;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TareaAgente = sequelize.define('TareaAgente', {
  TareaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tareas',
      key: 'id',
    },
  },
  AgenteId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Agentes',
      key: 'id',
    },
  },
});

module.exports = TareaAgente;
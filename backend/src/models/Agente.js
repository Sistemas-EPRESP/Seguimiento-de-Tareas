const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Agente = sequelize.define('Agente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Agente;
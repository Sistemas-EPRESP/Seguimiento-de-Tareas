const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  rol: {
    type: DataTypes.ENUM('Administrador', 'Personal', 'Desarrollador'),
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  agenteId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Agentes',
      key: 'id',
    },
    allowNull: false,
  },
});

module.exports = Usuario;
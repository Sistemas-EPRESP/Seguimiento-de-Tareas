const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  rol: {
    type: DataTypes.ENUM('Administrador', 'Personal', 'Desarrollador'),
    allowNull: false,
  },
  agenteId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Agentes',  // Nombre de la tabla en la base de datos
      key: 'id',
    },
  },
});

module.exports = Usuario;
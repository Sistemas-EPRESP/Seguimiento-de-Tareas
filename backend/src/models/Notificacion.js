const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notificacion = sequelize.define('Notificacion', {
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mensaje: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM('Pendiente', 'Aceptada', 'Declinada'),
    defaultValue: 'Pendiente',
    allowNull: false,
  },
});

module.exports = Notificacion;
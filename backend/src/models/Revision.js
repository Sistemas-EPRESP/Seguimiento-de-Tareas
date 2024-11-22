const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Revision = sequelize.define('Revision', {
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Corrección no realizada por defecto
  },
  tareaId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Tareas',  // Nombre de la tabla en la base de datos
      key: 'id',
    },
  },
});

module.exports = Revision;
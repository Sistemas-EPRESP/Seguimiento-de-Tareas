const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

const Revision = sequelize.define('Revision', {
  descripcion: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  fecha_hora: {
    type: DataTypes.DATE,
    allowNull: false,
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
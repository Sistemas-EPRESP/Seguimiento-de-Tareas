const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Correccion = sequelize.define('Correccion', {
  tipo: {
    type: DataTypes.ENUM('Ortografía', 'Formato', 'Contenido', 'Otras'),
    allowNull: false,
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Corrección no realizada por defecto
  },
  revisionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Revisions',  // Asegúrate que el nombre de la tabla sea correcto
      key: 'id',
    },
    onDelete: 'CASCADE',  // Elimina las correcciones si la revisión es eliminada
  },
});

module.exports = Correccion;
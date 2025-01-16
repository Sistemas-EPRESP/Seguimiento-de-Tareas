// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Agente = sequelize.define('Agente', {
//   nombre: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
//   apellido: {
//     type: DataTypes.STRING,
//     allowNull: false,
//   },
// });

// module.exports = Agente;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const Agente = sequelize.define('Agente', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('nombre');
      return capitalize(rawValue);
    }
  },
  apellido: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const rawValue = this.getDataValue('apellido');
      return capitalize(rawValue);
    }
  },
});

module.exports = Agente;
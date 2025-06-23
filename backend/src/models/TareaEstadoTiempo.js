const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TareaEstadoTiempo = sequelize.define("TareaEstadoTiempo", {
  estado: {
    type: DataTypes.ENUM(
      "Sin comenzar",
      "Curso",
      "Revisión",
      "Confirmación de revisión",
      "Corrección",
      "Bloqueada",
      "Finalizado"
    ),
    allowNull: false,
  },
  tiempo_acumulado: {
    type: DataTypes.INTEGER, // Tiempo en segundos
    defaultValue: 0,
  },
  ultima_entrada: {
    type: DataTypes.DATE, // Última vez que se puso en este estado
    allowNull: true,
  },
  tareaId: {
    type: DataTypes.INTEGER,
    references: {
      model: "Tareas",
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = TareaEstadoTiempo;

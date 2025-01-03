require('dotenv').config();
const { Sequelize } = require('sequelize');


const sequelize = new Sequelize('seguimiento-de-tareas', 'postgres', 'sanlorenzo', {
  host: 'localhost',
  dialect: 'postgres', // Ajustar la zona horaria a la de la base de datos
  logging: (msg) => {
    if (msg.startsWith('Executing (default):')) {
      return; // No mostrar consultas SQL
    }
    console.log(msg); // Mostrar otros mensajes
  },
});

module.exports = sequelize;


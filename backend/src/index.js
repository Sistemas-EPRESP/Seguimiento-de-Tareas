const express = require('express');
const sequelize = require('./config/database');
const agenteRoutes = require('./routes/agenteRoutes'); // Asegúrate de que la ruta esté importada
const tareasRoutes = require('./routes/tareaRoutes')
const revisionRoutes = require('./routes/revisionRoutes')
const cors = require('cors'); // Importa el middleware cors
require('./models/associations'); // Asegúrate de que esto se ejecute para cargar las asociaciones

// Crea una instancia de Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // Permite solicitudes desde esta URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type'], // Encabezados permitidos
}));

// Importa las rutas. Ahora todas las rutas estarán prefijadas con /api
app.use('/api', tareasRoutes);
app.use('/api', agenteRoutes);
app.use('/api', revisionRoutes);



// Sincronización de la base de datos
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de datos y tablas creadas');

    // Inicia el servidor después de la sincronización
    app.listen(3000, '0.0.0.0', () => {
      console.log('Servidor ejecutándose en el puerto 3000');
    });
  })
  .catch((error) => {
    console.error('Error al crear la base de datos y tablas:', error);
  });
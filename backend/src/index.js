const express = require('express');
const sequelize = require('./config/database');
const agenteRoutes = require('./routes/agenteRoutes');
const tareasRoutes = require('./routes/tareaRoutes');
const revisionRoutes = require('./routes/revisionRoutes');
const authRoutes = require('./routes/authRoutes');
const correccionesRoutes = require('./routes/correccionesRoutes');
const reportesRoutes = require('./routes/reportesRoutes');
const cors = require('cors');
const authenticateToken = require('./middlewares/authMiddleware'); // Importa el middleware de autenticación
require('./models/associations'); // Asegúrate de que las asociaciones se carguen

// Crea una instancia de Express
const app = express();

// Middleware para manejar JSON
app.use(express.json());

// Configuración de CORS
app.use(cors({
  origin: '*', // Permitir solicitudes desde cualquier origen
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //allowedHeaders: ['Content-Type', 'Authorization'], // Asegúrate de permitir el encabezado de autorización
}));

// Rutas sin protección
app.use('/api', authRoutes); // Rutas de autenticación (login) no protegidas

// Rutas protegidas con middleware de autenticación
app.use('/api', authenticateToken, tareasRoutes);
app.use('/api', authenticateToken, agenteRoutes);
app.use('/api', authenticateToken, revisionRoutes);
app.use('/api', authenticateToken, reportesRoutes);
//app.use('/api', authenticateToken, correccionesRoutes);
//app.use('/api', reportesRoutes);

// app.use('/api', tareasRoutes);
// app.use('/api', agenteRoutes);
// app.use('/api', revisionRoutes);
// app.use('/api', correccionesRoutes);


// Sincronización de la base de datos
sequelize
  .sync({ alter: true })
  //.authenticate()
  .then(() => {
    console.log('Conexión establecida correctamente con la base de datos');

    // Inicia el servidor después de la sincronización
    app.listen(3000, '0.0.0.0', () => {
      console.log('Servidor ejecutándose en el puerto 3000');
    });
  })
  .catch((error) => {
    console.error('Error al establecer conexión con la base de datos', error);
  });
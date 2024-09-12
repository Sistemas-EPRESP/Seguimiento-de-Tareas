const Agente = require('./Agente');
const Usuario = require('./Usuario');
const Tarea = require('./Tarea');
const Revision = require('./Revision');
const TareaAgente = require('./TareaAgente');

// Relación muchos a muchos entre Tarea y Agente
Tarea.belongsToMany(Agente, { through: TareaAgente });
Agente.belongsToMany(Tarea, { through: TareaAgente });

// Relación uno a muchos entre Tarea y Revision
Tarea.hasMany(Revision, { foreignKey: 'tareaId' });
Revision.belongsTo(Tarea, { foreignKey: 'tareaId' });

// Relación uno a uno entre Agente y Usuario
Agente.hasOne(Usuario, { foreignKey: 'agenteId' });
Usuario.belongsTo(Agente, { foreignKey: 'agenteId' });

module.exports = {
  Agente,
  Usuario,
  Tarea,
  Revision,
  TareaAgente,
};
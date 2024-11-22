const Agente = require('./Agente');
const Usuario = require('./Usuario');
const Tarea = require('./Tarea');
const Revision = require('./Revision');
const TareaAgente = require('./TareaAgente');
const Correccion = require('./Correccion');

// Relación muchos a muchos entre Tarea y Agente
Tarea.belongsToMany(Agente, { through: TareaAgente, onDelete: 'CASCADE' }); // Eliminar la relación en la tabla intermedia
Agente.belongsToMany(Tarea, { through: TareaAgente, onDelete: 'CASCADE' });

// Relación uno a muchos entre Tarea y Revision
Tarea.hasMany(Revision, { foreignKey: 'tareaId', onDelete: 'CASCADE' }); // Eliminar las revisiones asociadas a la tarea
Revision.belongsTo(Tarea, { foreignKey: 'tareaId' });

// Relación uno a muchos entre Revision y Correccion
Revision.hasMany(Correccion, { foreignKey: 'revisionId', onDelete: 'CASCADE' });
Correccion.belongsTo(Revision, { foreignKey: 'revisionId' });

Usuario.belongsTo(Agente, { foreignKey: 'agenteId', as: 'agente' });
Agente.hasOne(Usuario, { foreignKey: 'agenteId', as: 'usuario' });

module.exports = {
  Agente,
  Usuario,
  Tarea,
  Revision,
  TareaAgente,
  Correccion,
};
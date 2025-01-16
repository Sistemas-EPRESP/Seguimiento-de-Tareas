const capitalizarNombreApellido = (agente) => {
  return {
    ...agente.toJSON(),
    nombre: agente.nombre.charAt(0).toUpperCase() + agente.nombre.slice(1),
    apellido: agente.apellido.charAt(0).toUpperCase() + agente.apellido.slice(1),
  };
};

module.exports = { capitalizarNombreApellido };
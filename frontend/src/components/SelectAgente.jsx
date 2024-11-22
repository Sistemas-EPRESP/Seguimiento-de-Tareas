// SelectAgente.js
const SelectAgente = ({ agentes, value, className, onChange }) => {
  // Manejar la selección de un agente
  const handleSelectChange = (e) => {
    onChange(e.target.value); // Pasamos el ID del agente seleccionado
  };

  return (
    <select
      value={value} // El valor seleccionado
      onChange={handleSelectChange} // Evento de cambio
      className={className}
    >
      <option value="">Selecciona un agente</option>
      {agentes.map((agente) => (
        <option key={agente.id} value={agente.id}>
          {agente.nombre} {agente.apellido}
        </option>
      ))}
    </select>
  );
};

export default SelectAgente;

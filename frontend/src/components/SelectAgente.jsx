const SelectAgente = ({ agentes, className, onSelect }) => {
  const handleSelectChange = (e) => {
    const idAgente = e.target.value;
    onSelect(idAgente); // Llamamos a la función pasada como prop
  };

  return (
    <select onChange={handleSelectChange} className={className}>
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

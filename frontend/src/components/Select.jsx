import { useState } from "react";

export default function Select({
  label,
  opciones,
  onChange,
  defaultValue = "",
  labelClassName = "", // Clases personalizadas para el label
  selectClassName = "", // Clases personalizadas para el select
}) {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setSelectedOption(value);
    onChange(value);
  };

  return (
    <div className="flex space-x-2 items-center">
      <label className={labelClassName}>{label}</label>
      <select
        value={selectedOption}
        onChange={handleChange}
        className={selectClassName}
      >
        <option value="">Todos</option>
        {opciones.map((opcion) => (
          <option key={opcion} value={opcion}>
            {opcion}
          </option>
        ))}
      </select>
    </div>
  );
}

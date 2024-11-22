import { useState } from "react";

export default function Select({
  label,
  opciones,
  onChange,
  placeHolder,
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
    <div className="">
      {label ?? <label className={labelClassName}>{label}</label>}

      <select
        value={selectedOption}
        onChange={handleChange}
        className={selectClassName}
      >
        <option value="">{placeHolder}</option>
        {opciones.map((opcion) =>
          typeof opcion === "string" ? (
            <option key={opcion} value={opcion}>
              {opcion}
            </option>
          ) : (
            <option key={opcion.value} value={opcion.value}>
              {opcion.label}
            </option>
          )
        )}
      </select>
    </div>
  );
}

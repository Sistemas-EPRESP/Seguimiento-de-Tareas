import Select from "../components/Select"; // Importa el componente Select

export default function Filtro({
  label,
  opciones,
  onChange,
  placeHolder,
  labelClassName,
  selectClassName,
}) {
  return (
    <div className="flex space-x-2 items-center">
      <Select
        label={label}
        opciones={opciones}
        onChange={onChange}
        placeHolder={placeHolder}
        labelClassName={labelClassName}
        selectClassName={selectClassName}
      />
    </div>
  );
}

import CloseIcon from "@mui/icons-material/Close";

const AgenteSeleccionado = ({ agente, onRemove }) => {
  return (
    <div className="inline-flex justify-between items-center bg-gray-600 text-gray-100 rounded-full px-3">
      <span className="text-white mr-2">
        {agente.nombre} {agente.apellido}
      </span>
      <button
        onClick={onRemove}
        className="text-red-500 font-bold hover:text-red-700"
      >
        <CloseIcon style={{ width: "16px", color: "white" }} />
      </button>
    </div>
  );
};

export default AgenteSeleccionado;
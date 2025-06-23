import PropTypes from "prop-types";

function SwitchModoUsuarioBtn({
  setModoVista,
  setActualizarTarea,
  modoACambiar = "",
}) {
  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() =>
          setModoVista(
            (prevModo) =>
              prevModo === "Administrador" ? "Agente" : "Administrador",
            setActualizarTarea((prev) => !prev)
          )
        }
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        Cambiar a modo {modoACambiar}
      </button>
    </div>
  );
}

SwitchModoUsuarioBtn.propTypes = {
  setModoVista: PropTypes.func.isRequired,
  setActualizarTarea: PropTypes.func.isRequired,
  modoACambiar: PropTypes.string,
};

export default SwitchModoUsuarioBtn;

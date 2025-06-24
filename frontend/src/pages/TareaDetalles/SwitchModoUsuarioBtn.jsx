import PropTypes from "prop-types";

function SwitchModoUsuarioBtn({ dispatch, modoACambiar }) {
  return (
    <div className="fixed bottom-4 right-4">
      <button
        onClick={() => {
          dispatch({ type: "SWITCH_MODO" });
          dispatch({ type: "ACTUALIZAR_TAREA" });
        }}
        className="bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
      >
        Cambiar a modo {modoACambiar}
      </button>
    </div>
  );
}

SwitchModoUsuarioBtn.propTypes = {
  dispatch: PropTypes.func.isRequired,
  modoACambiar: PropTypes.string,
};

export default SwitchModoUsuarioBtn;

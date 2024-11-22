import CloseIcon from "@mui/icons-material/Close";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

export default function ModalInformativo({ modalInfo, onClose }) {
  // Si el modal no está visible, no se renderiza

  //const titulo = tipo === "exito" ? "¡Éxito!" : "Error";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="flex flex-col items-center rounded-lg border border-gray-600 shadow-sm p-6  z-10 w-full max-w-md bg-gray-800">
        <div className="flex flex-col space-y-1.5 p-6">
          <h3 className="whitespace-nowrap leading-none tracking-tight text-center text-gray-100 text-2xl font-semibold">
            {modalInfo.titulo}
          </h3>
        </div>
        <div className="flex flex-col items-center p-6">
          {modalInfo.tipo === "Exito" ? (
            <TaskAltIcon
              className="mb-4 text-green-400"
              style={{ width: "60px", height: "60px" }}
            />
          ) : (
            <HighlightOffIcon
              className="mb-4 text-red-400"
              style={{ width: "60px", height: "60px" }}
            />
          )}
          <p className="text-center text-base text-gray-300">
            {modalInfo.mensaje}
          </p>
        </div>
        <div className="items-center p-6 flex justify-center">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-gray-600 text-white hover:bg-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

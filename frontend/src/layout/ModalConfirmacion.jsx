export default function ModalConfirmacion({
  open,
  onClose,
  onConfirm,
  mensaje,
}) {
  if (!open) return null; // Si el modal no está abierto, no se muestra

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Confirmar acción</h2>
        <p className="mb-6">
          {mensaje || "¿Estás seguro de que deseas realizar esta acción?"}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

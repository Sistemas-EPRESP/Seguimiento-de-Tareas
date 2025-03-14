export default function ModalNotificacion({
  visible,
  titulo,
  descripcion,
  onConfirm,
  onCancel,
}) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-45 z-50">
      <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">{titulo}</h2>
        <p className="text-white mb-6">{descripcion}</p>
        <div className="flex justify-end gap-4">
          <button
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-400"
            onClick={onCancel}
          >
            Cancelar
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-xl hover:bg-blue-600"
            onClick={onConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

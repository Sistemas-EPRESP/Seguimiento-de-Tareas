import { useState } from "react";
import { api } from "../../api/api";
import CrearRevision from "./CrearRevision";
import ModalConfirmacion from "../../layout/ModalConfirmacion";
import PropTypes from "prop-types";
import RevisionItem from "./RevisionItem";

export default function Revisiones({ tarea, revisiones, onActualizar }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [listaRevisiones, setListaRevisiones] = useState(revisiones);
  const [modalVisible, setModalVisible] = useState(false);
  const [revisionAEliminar, setRevisionAEliminar] = useState(null);
  const deleteRevision = async (id) => {
    try {
      await api.delete(`/revisiones/${id}`);
      setListaRevisiones((prevRevisiones) =>
        prevRevisiones.filter((revision) => revision.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleConfirmarEliminar = () => {
    if (revisionAEliminar) {
      deleteRevision(revisionAEliminar.id);
      setRevisionAEliminar(null);
      setModalVisible(false);
    }
  };

  const handleRevisionCreada = (nuevaRevision) => {
    setListaRevisiones((prevRevisiones) => [...prevRevisiones, nuevaRevision]);
  };

  return (
    <div id="REVISIONES" className="flex flex-col gap-4">
      <div className="flex flex-col bg-gray-800 rounded-xl p-6">
        <h2 className="text-3xl font-bold mb-2">Revisiones</h2>
        <div className="flex-grow max-h-[465px] overflow-y-auto pr-2 mb-4">
          {listaRevisiones.length > 0 ? (
            <ul className="space-y-2">
              {listaRevisiones.map((revision) => (
                <RevisionItem
                  revision={revision}
                  setters={{ setRevisionAEliminar, setModalVisible }}
                  key={revision.id}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-100 opacity-50">No hay revisiones</p>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          title={
            tarea.estado === "Finalizado"
              ? "La tarea está finalizada. Para agregar revisiones, primero cambie el estado de la misma."
              : "Añadir una nueva revisión a la tarea"
          }
          disabled={tarea.estado === "Finalizado"}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded-xl disabled:cursor-not-allowed disabled:bg-gray-700 disabled:text-gray-400"
        >
          Añadir Revisión
        </button>
      </div>

      {modalOpen && (
        <CrearRevision
          tareaId={tarea.id}
          onClose={() => setModalOpen(false)}
          onRevisionCreada={handleRevisionCreada}
          onActualizar={onActualizar}
        />
      )}
      <ModalConfirmacion
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmarEliminar}
        mensaje="¿Estás seguro de que deseas eliminar esta revisión?"
      />
    </div>
  );
}

Revisiones.propTypes = {
  tarea: PropTypes.object,
  revisiones: PropTypes.array,
  onActualizar: PropTypes.func,
};

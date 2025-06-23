import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete"; // Icono de eliminar
import { format } from "date-fns";
import { useState } from "react";
import { es } from "date-fns/locale";
import axios from "axios";
import config from "../../api/config";
import CrearRevision from "./CrearRevision";
import ModalConfirmacion from "../../layout/ModalConfirmacion";
import PropTypes from "prop-types";

export default function Revisiones({ tareaId, revisiones, onActualizar }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [listaRevisiones, setListaRevisiones] = useState(revisiones);
  const [modalVisible, setModalVisible] = useState(false);
  const [revisionAEliminar, setRevisionAEliminar] = useState(null);
  const [expandidaRevisiones, setExpandidaRevisiones] = useState([]);
  const token = localStorage.getItem("token");

  const toggleExpandirRevision = (revisionId) => {
    setExpandidaRevisiones((prevIds) =>
      prevIds.includes(revisionId)
        ? prevIds.filter((id) => id !== revisionId)
        : [...prevIds, revisionId]
    );
  };

  const deleteRevision = async (id) => {
    try {
      await axios.delete(`${config.apiUrl}/revisiones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setListaRevisiones((prevRevisiones) =>
        prevRevisiones.filter((revision) => revision.id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleEliminarClick = (revision) => {
    setRevisionAEliminar(revision);
    setModalVisible(true);
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
                <li
                  key={revision.id}
                  className="bg-gray-700 border border-gray-600 rounded-lg"
                >
                  <div className="flex justify-between items-center px-4 py-2">
                    <button
                      className="flex-1 text-left hover:rounded-lg focus:outline-none"
                      onClick={() => toggleExpandirRevision(revision.id)}
                    >
                      <span>
                        {format(
                          new Date(revision.fecha_hora),
                          "EEEE, d 'de' MMMM 'de' yyyy, h:mm aa",
                          { locale: es }
                        )}
                      </span>
                    </button>
                    <div className="flex space-x-2">
                      <button className="text-red-400 hover:text-red-500">
                        <DeleteIcon
                          onClick={() => handleEliminarClick(revision)}
                        />
                      </button>
                    </div>
                    {expandidaRevisiones.includes(revision.id) ? (
                      <ExpandLessIcon className="text-white" />
                    ) : (
                      <ExpandMoreIcon className="text-white" />
                    )}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      expandidaRevisiones.includes(revision.id)
                        ? "max-h-screen"
                        : "max-h-0"
                    }`}
                  >
                    <div className="p-4 bg-gray-700 rounded-b-lg">
                      {revision.Correccions.length > 0 && (
                        <ul className="space-y-1">
                          {revision.Correccions.map((correccion) => (
                            <li
                              key={correccion.id}
                              className={`flex items-center ${
                                correccion.estado
                                  ? "line-through text-gray-400"
                                  : ""
                              }`}
                            >
                              {correccion.estado ? (
                                <TaskAltIcon
                                  className="mr-2 text-green-400"
                                  style={{ width: "18px" }}
                                />
                              ) : (
                                <HighlightOffIcon
                                  className="mr-2 text-red-400"
                                  style={{ width: "18px" }}
                                />
                              )}
                              {correccion.tipo} -{" "}
                              {correccion.estado ? "Realizada" : "Pendiente"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-100 opacity-50">No hay revisiones</p>
          )}
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 mt-2 rounded-xl"
        >
          Añadir Revisión
        </button>
      </div>

      {modalOpen && (
        <CrearRevision
          tareaId={tareaId}
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
  tareaId: PropTypes.number,
  revisiones: PropTypes.array,
  onActualizar: PropTypes.func,
};

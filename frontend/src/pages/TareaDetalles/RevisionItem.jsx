import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PropTypes from "prop-types";
function RevisionItem({ revision, setters }) {
  const [expandidaRevisiones, setExpandidaRevisiones] = useState([]);

  const toggleExpandirRevision = (revisionId) => {
    setExpandidaRevisiones((prevIds) =>
      prevIds.includes(revisionId)
        ? prevIds.filter((id) => id !== revisionId)
        : [...prevIds, revisionId]
    );
  };

  const handleEliminarClick = (revision) => {
    setters.setRevisionAEliminar(revision);
    setters.setModalVisible(true);
  };

  return (
    <li className="bg-gray-700 border border-gray-600 rounded-lg">
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
            <DeleteIcon onClick={() => handleEliminarClick(revision)} />
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
          expandidaRevisiones.includes(revision.id) ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-700 rounded-b-lg">
          {revision.Correccions.length > 0 && (
            <ul className="space-y-1">
              {revision.Correccions.map((correccion) => (
                <li
                  key={correccion.id}
                  className={`flex items-center ${
                    correccion.estado ? "line-through text-gray-400" : ""
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
  );
}

RevisionItem.propTypes = {
  revision: PropTypes.object,
  setters: PropTypes.objectOf(PropTypes.func),
};

export default RevisionItem;

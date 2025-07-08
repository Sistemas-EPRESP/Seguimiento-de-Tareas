import { format } from "date-fns";
import { es } from "date-fns/locale";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import ReportGmailerrorredOutlinedIcon from "@mui/icons-material/ReportGmailerrorredOutlined";
import PropTypes from "prop-types";
function RevisionItem({ revision, setters }) {
  const handleEliminarClick = (revision) => {
    setters.setRevisionAEliminar(revision);
    setters.setModalVisible(true);
  };

  return (
    <li>
      <div className="flex justify-between items-center ps-1 pe-4 py-2">
        <div className="flex-1 text-left text-sm hover:rounded-lg focus:outline-none">
          <span>
            {format(
              new Date(revision.fecha_hora),
              "EEEE, d 'de' MMMM 'de' yyyy, h:mm aa",
              { locale: es }
            )}
          </span>
        </div>
        <div className="flex space-x-2">
          <button
            className="text-gray-300 hover:text-red-500"
            title="Eliminar revisiones"
          >
            <DeleteIcon onClick={() => handleEliminarClick(revision)} />
          </button>
        </div>
      </div>

      <div className={`overflow-hidden transition-all duration-300`}>
        <div className="px-4 pb-2 rounded-b-lg">
          {revision.Correccions.length > 0 && (
            <ul className="space-y-1">
              {revision.Correccions.map((correccion) => (
                <li
                  key={correccion.id}
                  className={`flex items-center cursor-pointer after:ml-2 after:text-xs after:text-gray-400 ${
                    correccion.estado ? "line-through text-gray-400" : ""
                  }
                  ${
                    correccion.estado
                      ? "hover:after:content-['Realizado']"
                      : "hover:after:content-['Pendiente']"
                  }`}
                >
                  {correccion.estado ? (
                    <TaskAltIcon
                      className="mr-2 text-green-400"
                      style={{ width: "1.3rem" }}
                    />
                  ) : (
                    <ReportGmailerrorredOutlinedIcon
                      className="mr-2 text-sky-400"
                      style={{ width: "1.3rem" }}
                    />
                  )}
                  {correccion.tipo}
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

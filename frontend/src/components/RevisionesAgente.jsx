import TaskAltIcon from "@mui/icons-material/TaskAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { api } from "../api/api";
import config from "../api/config";
import ModalInformativo from "../layout/ModalInformativo";
import Loading from "../layout/Loading";
import ModalConfirmacion from "../layout/ModalConfirmacion";

export default function Component({
  tareaId,
  revisiones: initialRevisiones,
  onCorreccionesEnviadas,
}) {
  const [revisionesExpandidas, setRevisionesExpandidas] = useState([]);
  const token = localStorage.getItem("token");
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalConfirmacionVisible, setModalConfirmacionVisible] =
    useState(false);
  const [listaRevisiones, setListaRevisiones] = useState(
    initialRevisiones.map((revision) => ({
      ...revision,
      Correccions: revision.Correccions.map((correccion) => ({
        ...correccion,
        estado: correccion.estado,
      })),
    }))
  );

  const toggleExpandirRevision = (revisionId) => {
    setRevisionesExpandidas((prevExpandidas) =>
      prevExpandidas.includes(revisionId)
        ? prevExpandidas.filter((id) => id !== revisionId)
        : [...prevExpandidas, revisionId]
    );
  };

  const handleCheckboxChange = (revisionId, correccionId) => {
    setListaRevisiones((prevRevisiones) =>
      prevRevisiones.map((revision) =>
        revision.id === revisionId
          ? {
              ...revision,
              Correccions: revision.Correccions.map((correccion) =>
                correccion.id === correccionId
                  ? { ...correccion, estado: !correccion.estado }
                  : correccion
              ),
            }
          : revision
      )
    );
  };

  // Verificar si al menos una corrección tiene el estado 'true'
  const revisarChecks = listaRevisiones.some(
    (revision) =>
      !revision.estado && // Solo considerar revisiones que no estén completadas
      revision.Correccions.some((correccion) => correccion.estado)
  );

  const hasRevisiones = listaRevisiones.length > 0;

  const handleEnviarCambios = () => {
    if (revisarChecks) {
      setModalConfirmacionVisible(true);
    }
  };

  const confirmarEnviarCambios = async () => {
    setModalConfirmacionVisible(false);
    setLoadingOpen(true);

    try {
      await api.put(`/correcciones/estado`, listaRevisiones);
      setLoadingOpen(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Exito",
        titulo: "Correcciones aplicadas",
        mensaje: "Las correcciones fueron aplicadas correctamente!",
      });
      onCorreccionesEnviadas(); // Llamar a la función de callback después de enviar las correcciones
    } catch (error) {
      setLoadingOpen(false);
      setModalVisible(true);
      setModalInfo({
        tipo: "Error",
        titulo: "Error del servidor",
        mensaje: "No fue posible realizar esta acción!",
      });
    }
  };

  return (
    <div id="REVISIONES" className="flex flex-col gap-4 w-full max-w-md">
      <div className="flex flex-col bg-gray-800 rounded-xl p-6 h-[350px]">
        <h2 className="text-3xl font-bold mb-4">Revisiones</h2>
        <div className="flex-grow overflow-y-auto pr-2 mb-4 h-[250px]">
          {hasRevisiones ? (
            <ul className="space-y-2">
              {listaRevisiones.map((revision) => (
                <li
                  key={revision.id}
                  className={`bg-gray-700 border border-gray-600 rounded-lg ${
                    revision.estado ? "line-through text-gray-400" : ""
                  }`}
                >
                  <button
                    className="w-full flex justify-between items-center px-4 py-2 text-left hover:bg-gray-600 focus:outline-none rounded-lg"
                    onClick={() => toggleExpandirRevision(revision.id)}
                  >
                    <span className="text-sm">
                      {format(
                        new Date(revision.fecha_hora),
                        "EEEE, d 'de' MMMM 'de' yyyy, h:mm aa",
                        { locale: es }
                      )}
                    </span>
                    {revisionesExpandidas.includes(revision.id) ? (
                      <ExpandLessIcon className="text-white" />
                    ) : (
                      <ExpandMoreIcon className="text-white" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      revisionesExpandidas.includes(revision.id)
                        ? "max-h-screen"
                        : "max-h-0"
                    }`}
                  >
                    <div className="p-4 bg-gray-700 rounded-b-lg">
                      {revision.Correccions.length > 0 && (
                        <ul className="space-y-2">
                          {revision.Correccions.map((correccion) => (
                            <li
                              key={correccion.id}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                checked={correccion.estado}
                                onChange={() =>
                                  handleCheckboxChange(
                                    revision.id,
                                    correccion.id
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-blue-600"
                                disabled={revision.estado}
                              />
                              {correccion.estado ? (
                                <TaskAltIcon
                                  className="text-green-400"
                                  style={{ width: "18px" }}
                                />
                              ) : (
                                <HighlightOffIcon
                                  className="text-red-400"
                                  style={{ width: "18px" }}
                                />
                              )}
                              <span className="text-sm">{correccion.tipo}</span>
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
            <p className="text-gray-100 opacity-50">
              No hay correcciones disponibles.
            </p>
          )}
        </div>
        <button
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl ${
            (!hasRevisiones || !revisarChecks) &&
            "opacity-50 cursor-not-allowed"
          }`}
          onClick={handleEnviarCambios}
          disabled={!hasRevisiones || !revisarChecks}
        >
          Guardar
        </button>
      </div>
      {loadingOpen && <Loading />}
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)}
        />
      )}
      {modalConfirmacionVisible && (
        <ModalConfirmacion
          open={modalConfirmacionVisible}
          onClose={() => setModalConfirmacionVisible(false)}
          onConfirm={confirmarEnviarCambios}
          mensaje="¿Estás seguro de que deseas aplicar estas correcciones?"
        />
      )}
    </div>
  );
}

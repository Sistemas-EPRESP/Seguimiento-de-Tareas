import { useState } from "react";
import Modal from "../layout/Modal";
import Select from "./Select";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import config from "../api/config";
import ModalInformativo from "../layout/ModalInformativo";
import Loading from "../layout/Loading";

export default function CrearRevision({ tareaId, onClose, onRevisionCreada }) {
  const [correcciones, setCorrecciones] = useState([]);
  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingOpen, setLoadingOpen] = useState(false);

  const token = localStorage.getItem("token");

  const handleSelectCorreccion = (correccionSeleccionada) => {
    if (
      correccionSeleccionada &&
      !correcciones.includes(correccionSeleccionada)
    ) {
      setCorrecciones((prevCorrecciones) => [
        ...prevCorrecciones,
        correccionSeleccionada,
      ]);
    }
  };

  const eliminarCorreccion = (correccionAEliminar) => {
    setCorrecciones((prevCorrecciones) =>
      prevCorrecciones.filter((c) => c !== correccionAEliminar)
    );
  };

  const handleGuardarRevision = async () => {
    setLoadingOpen(true);
    try {
      const nuevaRevision = {
        fecha_hora: new Date(),
        correcciones: correcciones.map((tipo) => ({
          tipo,
          estado: false,
        })),
      };

      const response = await axios.post(
        `${config.apiUrl}/tareas/${tareaId}/revisiones`,
        nuevaRevision,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setModalInfo({
        tipo: "Exito",
        titulo: "Revisión Creada!",
        mensaje: "¡Revisión creada con éxito!",
      });
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Error al crear",
        mensaje: "Ocurrió un error inesperado al crear la revisón",
      });
    } finally {
      await sleep(2000);
      setLoadingOpen(false);
      setModalVisible(true);
    }
  };

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <Modal onClose={onClose} onConfirm={handleGuardarRevision}>
      <h2 className="text-xl font-semibold mb-4">Revisión Nueva</h2>

      <Select
        label={"Seleccione la/s correcciones"}
        opciones={["Ortografía", "Formato"]}
        onChange={handleSelectCorreccion}
        value={""}
        labelClassName="block text-sm font-medium mb-1 text-gray-100"
        selectClassName="w-full px-3 py-2 bg-gray-700 text-gray-100 rounded-lg focus:outline-none"
      />

      {correcciones.length > 0 ? (
        <div className="pt-2 flex flex-wrap gap-2">
          {correcciones.map((correcion, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-700 px-2 py-1 rounded-lg mb-2"
              style={{ width: "auto" }} // Ajustar el ancho al contenido
            >
              <span className="text-white font-medium text-sm mr-1">
                {correcion}
              </span>
              <button
                type="button"
                className="text-red-400 hover:text-red-600"
                onClick={() => eliminarCorreccion(correcion)}
              >
                <CloseIcon style={{ width: "14px", color: "white" }} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay correcciones seleccionadas</p>
      )}

      <button
        onClick={handleGuardarRevision}
        className="bg-blue-500 text-white w-full py-2 px-4 mt-3 rounded-xl"
      >
        Guardar
      </button>
      {modalVisible && (
        <ModalInformativo
          modalInfo={modalInfo}
          onClose={() => setModalVisible(false)} // Pasar la función de cierre
        />
      )}
      {loadingOpen && <Loading />}
    </Modal>
  );
}

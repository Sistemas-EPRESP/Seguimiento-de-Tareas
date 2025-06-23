import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import config from "../../api/config";
import "react-datepicker/dist/react-datepicker.css";
import Revisiones from "./Revisiones";
import ModalInformativo from "../../layout/ModalInformativo";
import Loading from "../../layout/Loading";
import ModalNotificacion from "../../layout/ModalNotificacion";
import TareaHistorial from "./TareaHistorial";

import ModalConfirmacion from "../../layout/ModalConfirmacion";
import { AuthContext } from "../../context/AuthContext";
import { TareaAgente } from "../TareaAgente";
import SwitchModoUsuarioBtn from "./SwitchModoUsuarioBtn";
import FormModificarTarea from "./FormModificarTarea";

export default function TareaDetalles() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);
  const [notificacionPendiente, setNotificacionPendiente] = useState(false);
  const [actualizarTarea, setActualizarTarea] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    tipo: "",
    visible: false,
    titulo: "",
    mensaje: "",
  });
  const [modalVisible, setModalVisible] = useState(false); // Controla la visibilidad del modal
  const [loadingOpen, setLoadingOpen] = useState(false);
  const [tarea, setTarea] = useState(null);
  const [tareaEliminada, setTareaEliminada] = useState(false);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [modoVista, setModoVista] = useState("Administrador");

  useEffect(() => {
    const obtenerTarea = async () => {
      try {
        const { data } = await axios.get(`${config.apiUrl}/tareas/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const notificacionPendiente = data.Notificacions?.find(
          (n) =>
            n.estado === "Pendiente" &&
            (n.titulo === "Finalizacion de correcciones" ||
              n.titulo === "Finalizacion de tarea")
        );
        if (notificacionPendiente) {
          setNotificacionPendiente(notificacionPendiente);
        }
        setTarea(data);
      } catch (error) {
        console.error("Error al obtener los detalles de la tarea", error);
      }
    };

    obtenerTarea();
  }, [id, token, actualizarTarea]);

  const eliminarTarea = async () => {
    setConfirmarEliminar(false);
    setLoadingOpen(true);
    try {
      await axios.delete(`${config.apiUrl}/tareas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalInfo({
        tipo: "Exito",
        titulo: "Tarea Eliminada!",
        mensaje: "¡Tarea eliminada con éxito!",
      });
    } catch (error) {
      setModalInfo({
        tipo: "Error",
        titulo: "Error al eliminar",
        mensaje: "Ocurrió un error inesperado al eliminar la tarea",
      });
    } finally {
      setLoadingOpen(false);
      setModalVisible(true);
      setTareaEliminada(true);
    }
  };

  const cerrarModal = () => {
    setModalVisible(false);
    if (tareaEliminada) {
      navigate("/"); // Redirigir al inicio si la tarea fue eliminada
    }
  };

  const confirmarEntrega = async (e) => {
    e.preventDefault();
    const estado = { estado: "Revisión" };
    const notificacion = {
      idNotificacion: tarea.Notificacions[0].id,
      estado: "Aceptada",
    };
    try {
      const { data } = await axios.put(
        `${config.apiUrl}/tareas/${id}/cambiarEstado`,
        estado,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const resp = await axios.put(
        `${config.apiUrl}/tareas/${id}/confirmarNotificacion`,
        notificacion,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const historial = {
        tipo: "Revisión",
        descripcion: "La tarea se encuentra en proceso de revisión",
      };
      const resp2 = await axios.post(
        `${config.apiUrl}/tareas/${id}/historial`,
        historial,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setActualizarTarea((prev) => !prev);
      setModalInfo({
        tipo: "Exito",
        titulo: "Operación exitosa",
        mensaje: "Se confirmó la entrega de la tarea!",
      });
    } catch (error) {
      console.error(error);
      setModalInfo({
        tipo: "Error",
        titulo: "Error de servidor",
        mensaje: "No se pudo completar esta acción!",
      });
    } finally {
      setNotificacionPendiente(false);
      setCargando(false);
      setModalVisible(true);
    }
  };

  return (
    <>
      {usuario?.rol === "Administrador" && (
        <SwitchModoUsuarioBtn
          setModoVista={setModoVista}
          setActualizarTarea={setActualizarTarea}
          modoACambiar={
            modoVista === "Administrador" ? "Agente" : "Administrador"
          }
        />
      )}

      {modoVista === "Administrador" ? (
        <div className="flex flex-col mt-10 gap-3 md:grid md:grid-cols-8 md:auto-rows-min md:gap-5 md:mt-0">
          {tarea && <FormModificarTarea tarea={tarea} />}

          <div className="col-span-3">
            {tarea && (
              <Revisiones
                tareaId={id}
                tarea={tarea}
                revisiones={tarea.Revisions}
                onActualizar={() => setActualizarTarea((prev) => !prev)}
              />
            )}
          </div>
          <div className="col-span-8">
            {tarea && (
              <TareaHistorial
                historial={tarea.HistorialMovimientos}
                tiempos={tarea.TareaEstadoTiempos}
                estadoActual={tarea.estado}
              />
            )}
          </div>
          {notificacionPendiente && (
            <ModalNotificacion
              visible={notificacionPendiente}
              titulo={"Confirmar Entrega"}
              descripcion={"¿Deseas confirmar que la tarea fue entregada?"}
              onConfirm={(e) => confirmarEntrega(e)}
              onCancel={() => setNotificacionPendiente(false)}
            />
          )}
          {modalVisible && (
            <ModalInformativo
              modalInfo={modalInfo}
              onClose={cerrarModal} // Pasar la función de cierre
            />
          )}
          {loadingOpen && <Loading />}
          <ModalConfirmacion
            open={confirmarEliminar}
            onClose={() => setConfirmarEliminar(false)} // Cierra el modal
            onConfirm={eliminarTarea} // Llama a eliminarTarea al confirmar
            mensaje="¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer."
          />
        </div>
      ) : (
        <TareaAgente tarea={tarea} />
      )}
    </>
  );
}
